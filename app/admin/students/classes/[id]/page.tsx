'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Student {
  id: number;
  name: string;
  parent_name: string;
  status: string;
}

interface Class {
  id: number;
  name: string;
  teacher_in_charge: string;
  description: string;
}

interface Attendance {
  id?: number;
  student_id: number;
  status: string;
  notes: string;
}

interface Assessment {
  id: number;
  student_id: number;
  student_name: string;
  assessment_date: string;
  subject: string;
  score: number;
  grade: string;
  notes: string;
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'assessment'>('students');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<{ [key: number]: Attendance }>({});
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  
  // Assessment form
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    student_id: '',
    assessment_date: new Date().toISOString().split('T')[0],
    subject: '',
    score: '',
    notes: ''
  });

  // Add student to class (manual form)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    birth_place: '',
    birth_date: '',
    parent_name: '',
    parent_phone: '',
    address: ''
  });
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  // Edit assessment
  const [editingAssessmentId, setEditingAssessmentId] = useState<number | null>(null);
  const [editAssessmentData, setEditAssessmentData] = useState<any>(null);

  useEffect(() => {
    fetchClassData();
    fetchStudents();
  }, [classId]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    } else if (activeTab === 'assessment') {
      fetchAssessments();
    }
  }, [activeTab, selectedDate]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const cls = data.classes.find((c: Class) => c.id === parseInt(classId));
        setClassData(cls || null);
      }
    } catch (error) {
      console.error('Error fetching class:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/students?classId=${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/attendance?classId=${classId}&date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const attendanceMap: { [key: number]: Attendance } = {};
        data.attendance.forEach((att: any) => {
          attendanceMap[att.student_id] = {
            id: att.id,
            student_id: att.student_id,
            status: att.status,
            notes: att.notes || ''
          };
        });
        setAttendanceData(attendanceMap);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/assessments?classId=${classId}&date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAssessments(data.assessments || []);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleAttendanceChange = (studentId: number, field: 'status' | 'notes', value: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        [field]: value
      }
    }));
  };

  const saveAttendance = async (studentId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const attendance = attendanceData[studentId] || { student_id: studentId, status: 'present', notes: '' };
      
      const response = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          class_id: classId,
          attendance_date: selectedDate,
          status: attendance.status,
          notes: attendance.notes
        }),
      });

      if (response.ok) {
        alert('Absensi berhasil disimpan');
        fetchAttendance();
      } else {
        alert('Gagal menyimpan absensi');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Terjadi kesalahan');
    }
  };

  const saveAllAttendance = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const promises = students.map(student => {
        const attendance = attendanceData[student.id] || { student_id: student.id, status: 'present', notes: '' };
        return fetch('/api/admin/attendance', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: student.id,
            class_id: classId,
            attendance_date: selectedDate,
            status: attendance.status,
            notes: attendance.notes
          }),
        });
      });

      await Promise.all(promises);
      alert('Semua absensi berhasil disimpan');
      fetchAttendance();
    } catch (error) {
      console.error('Error saving all attendance:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/assessments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: assessmentForm.student_id,
          class_id: classId,
          assessment_date: assessmentForm.assessment_date,
          subject: assessmentForm.subject,
          score: parseInt(assessmentForm.score),
          notes: assessmentForm.notes
        }),
      });

      if (response.ok) {
        alert('Penilaian berhasil disimpan');
        setShowAssessmentForm(false);
        setAssessmentForm({
          student_id: '',
          assessment_date: new Date().toISOString().split('T')[0],
          subject: '',
          score: '',
          notes: ''
        });
        fetchAssessments();
      } else {
        alert('Gagal menyimpan penilaian');
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Terjadi kesalahan');
    }
  };

  const deleteAssessment = async (assessmentId: number) => {
    if (!confirm('Yakin ingin menghapus penilaian ini?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/assessments', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentId }),
      });

      if (response.ok) {
        alert('Penilaian berhasil dihapus');
        fetchAssessments();
      } else {
        alert('Gagal menghapus penilaian');
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Terjadi kesalahan');
    }
  };

  const createNewStudent = async () => {
    // Validation
    if (!newStudentForm.name || !newStudentForm.birth_date || !newStudentForm.parent_name) {
      alert('Nama Santri, Tanggal Lahir, dan Nama Orang Tua wajib diisi!');
      return;
    }

    // Validasi birth_place juga required
    if (!newStudentForm.birth_place) {
      alert('Tempat Lahir wajib diisi!');
      return;
    }

    setIsSavingStudent(true);
    try {
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStudentForm.name,
          birth_place: newStudentForm.birth_place,
          birth_date: newStudentForm.birth_date,
          parent_name: newStudentForm.parent_name,
          parent_phone: newStudentForm.parent_phone || '',
          class_id: parseInt(classId), // Langsung assign ke kelas ini
        }),
      });

      if (response.ok) {
        alert('Santri berhasil ditambahkan ke kelas!');
        setShowAddStudentModal(false);
        // Reset form
        setNewStudentForm({
          name: '',
          birth_place: '',
          birth_date: '',
          parent_name: '',
          parent_phone: '',
          address: ''
        });
        fetchStudents();
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menambahkan santri');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Terjadi kesalahan saat menambahkan santri');
    } finally {
      setIsSavingStudent(false);
    }
  };

  const removeStudentFromClass = async (studentId: number) => {
    if (!confirm('Yakin ingin mengeluarkan santri dari kelas ini?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,
          class_id: null
        }),
      });

      if (response.ok) {
        alert('Santri berhasil dikeluarkan dari kelas');
        fetchStudents();
      } else {
        alert('Gagal mengeluarkan santri');
      }
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Terjadi kesalahan');
    }
  };

  const startEditAssessment = (assessment: Assessment) => {
    setEditingAssessmentId(assessment.id);
    setEditAssessmentData({ ...assessment });
  };

  const cancelEditAssessment = () => {
    setEditingAssessmentId(null);
    setEditAssessmentData(null);
  };

  const saveEditAssessment = async (assessmentId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/assessments', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId,
          subject: editAssessmentData.subject,
          score: parseInt(editAssessmentData.score),
          notes: editAssessmentData.notes
        }),
      });

      if (response.ok) {
        alert('Penilaian berhasil diupdate');
        setEditingAssessmentId(null);
        setEditAssessmentData(null);
        fetchAssessments();
      } else {
        alert('Gagal mengupdate penilaian');
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      alert('Terjadi kesalahan');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/students">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!classData) {
    return (
      <AdminLayout currentPage="/admin/students">
        <div className="text-center py-8">
          <p className="text-gray-600">Kelas tidak ditemukan</p>
          <button
            onClick={() => router.push('/admin/students')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <button
              onClick={() => router.push('/admin/students')}
              className="text-blue-600 hover:underline mb-2"
            >
              ← Kembali ke Data Santri
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{classData.name}</h1>
            <p className="text-gray-600">Penanggung Jawab: {classData.teacher_in_charge}</p>
            {classData.description && (
              <p className="text-sm text-gray-500 mt-1">{classData.description}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'students'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Data Santri ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'attendance'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Absensi
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'assessment'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Penilaian Harian
            </button>
          </div>

          <div className="p-6">
            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    + Tambah Santri ke Kelas
                  </button>
                </div>

                {students.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada santri di kelas ini. Klik tombol di atas untuk menambahkan santri.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nama Santri</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nama Orang Tua</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student, index) => (
                          <tr key={student.id}>
                            <td className="px-4 py-3 text-sm text-black">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-black">{student.name}</td>
                            <td className="px-4 py-3 text-sm text-black">{student.parent_name}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                student.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {student.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removeStudentFromClass(student.id)}
                                className="text-red-600 hover:underline text-sm"
                              >
                                Keluarkan
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Pilih Tanggal:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <button
                    onClick={saveAllAttendance}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    💾 Simpan Semua
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nama Santri</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Catatan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.map((student, index) => (
                        <tr key={student.id}>
                          <td className="px-4 py-3 text-sm text-black">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-black">{student.name}</td>
                          <td className="px-4 py-3">
                            <select
                              value={attendanceData[student.id]?.status || 'present'}
                              onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-black text-sm"
                            >
                              <option value="present">Hadir</option>
                              <option value="absent">Alfa</option>
                              <option value="sick">Sakit</option>
                              <option value="permission">Izin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={attendanceData[student.id]?.notes || ''}
                              onChange={(e) => handleAttendanceChange(student.id, 'notes', e.target.value)}
                              placeholder="Catatan..."
                              className="px-2 py-1 border border-gray-300 rounded text-black text-sm w-full"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => saveAttendance(student.id)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Simpan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Assessment Tab */}
            {activeTab === 'assessment' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Filter Tanggal:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <button
                    onClick={() => setShowAssessmentForm(!showAssessmentForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {showAssessmentForm ? 'Tutup Form' : '+ Tambah Penilaian'}
                  </button>
                </div>

                {/* Assessment Form */}
                {showAssessmentForm && (
                  <form onSubmit={handleAssessmentSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Santri *</label>
                        <select
                          value={assessmentForm.student_id}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, student_id: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                          required
                        >
                          <option value="">Pilih Santri</option>
                          {students.map(student => (
                            <option key={student.id} value={student.id}>{student.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Tanggal *</label>
                        <input
                          type="date"
                          value={assessmentForm.assessment_date}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, assessment_date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Mata Pelajaran *</label>
                        <input
                          type="text"
                          value={assessmentForm.subject}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Contoh: Tajwid, Hafalan"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Nilai (0-100) *</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={assessmentForm.score}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, score: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-black mb-2">Catatan</label>
                        <textarea
                          value={assessmentForm.notes}
                          onChange={(e) => setAssessmentForm(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                          rows={2}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Simpan Penilaian
                    </button>
                  </form>
                )}

                {/* Assessment List */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Tanggal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nama Santri</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Mata Pelajaran</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nilai</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Grade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Catatan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assessments.map((assessment) => {
                        const isEditing = editingAssessmentId === assessment.id;
                        return (
                          <tr key={assessment.id}>
                            <td className="px-4 py-3 text-sm text-black">
                              {new Date(assessment.assessment_date).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-black">{assessment.student_name}</td>
                            <td className="px-4 py-3 text-sm text-black">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editAssessmentData.subject}
                                  onChange={(e) => setEditAssessmentData({ ...editAssessmentData, subject: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded text-black text-sm w-full"
                                />
                              ) : (
                                assessment.subject
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-black">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editAssessmentData.score}
                                  onChange={(e) => setEditAssessmentData({ ...editAssessmentData, score: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded text-black text-sm w-20"
                                />
                              ) : (
                                assessment.score
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                assessment.grade === 'A' ? 'bg-green-100 text-green-800' :
                                assessment.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                assessment.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {assessment.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-black">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editAssessmentData.notes || ''}
                                  onChange={(e) => setEditAssessmentData({ ...editAssessmentData, notes: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded text-black text-sm w-full"
                                  placeholder="Catatan..."
                                />
                              ) : (
                                assessment.notes || '-'
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => saveEditAssessment(assessment.id)}
                                      className="text-green-600 hover:underline text-sm"
                                    >
                                      Simpan
                                    </button>
                                    <button
                                      onClick={cancelEditAssessment}
                                      className="text-gray-600 hover:underline text-sm"
                                    >
                                      Batal
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => startEditAssessment(assessment)}
                                      className="text-blue-600 hover:underline text-sm"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteAssessment(assessment.id)}
                                      className="text-red-600 hover:underline text-sm"
                                    >
                                      Hapus
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {assessments.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            Belum ada data penilaian untuk tanggal ini
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
            <h3 className="text-xl font-bold text-black mb-4">📝 Tambah Santri Baru ke Kelas</h3>
            <p className="text-sm text-gray-600 mb-6">Isi data santri yang akan ditambahkan ke kelas <span className="font-semibold">{classData?.name}</span></p>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Nama Santri */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Nama Santri <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  placeholder="Contoh: Ahmad Zaki"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newStudentForm.birth_place}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, birth_place: e.target.value })}
                    placeholder="Contoh: Jakarta"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newStudentForm.birth_date}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, birth_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Nama Orang Tua */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Nama Orang Tua/Wali <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newStudentForm.parent_name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, parent_name: e.target.value })}
                  placeholder="Contoh: Bapak Abdullah"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* No HP Orang Tua */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  No. HP Orang Tua
                </label>
                <input
                  type="tel"
                  value={newStudentForm.parent_phone}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, parent_phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  value={newStudentForm.address}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, address: e.target.value })}
                  placeholder="Contoh: Jl. Masjid No. 123, RT 01/RW 05, Kelurahan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <strong>ℹ️ Info:</strong> Santri akan langsung terdaftar di kelas <strong>{classData?.name}</strong> setelah disimpan.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  setNewStudentForm({
                    name: '',
                    birth_place: '',
                    birth_date: '',
                    parent_name: '',
                    parent_phone: '',
                    address: ''
                  });
                }}
                disabled={isSavingStudent}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={createNewStudent}
                disabled={isSavingStudent || !newStudentForm.name || !newStudentForm.birth_place || !newStudentForm.birth_date || !newStudentForm.parent_name}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSavingStudent ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Simpan ke Kelas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
