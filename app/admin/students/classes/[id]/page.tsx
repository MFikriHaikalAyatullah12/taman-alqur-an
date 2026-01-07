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

interface TeacherMaterial {
  id: number;
  title: string;
  description: string;
  material_date: string;
  created_at: string;
  teacher_name?: string;
}

interface TeacherAttendanceSummary {
  date: string;
  hadir: number;
  izin: number;
  sakit: number;
  alfa: number;
  total: number;
}

interface TeacherClassAttendance {
  id: number;
  class_id: number;
  teacher_name: string;
  attendance_date: string;
  status: string;
  notes: string;
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'assessment' | 'teacher-materials'>('students');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<{ [key: number]: Attendance }>({});
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [teacherMaterials, setTeacherMaterials] = useState<TeacherMaterial[]>([]);
  const [teacherAttendanceSummary, setTeacherAttendanceSummary] = useState<TeacherAttendanceSummary[]>([]);
  const [teacherClassAttendance, setTeacherClassAttendance] = useState<{ [key: string]: TeacherClassAttendance }>({});
  const [savingTeacherAttendance, setSavingTeacherAttendance] = useState<string | null>(null);
  
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

  // Export attendance
  const [exportMonth, setExportMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchClassData();
    fetchStudents();
  }, [classId]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    } else if (activeTab === 'assessment') {
      fetchAssessments();
    } else if (activeTab === 'teacher-materials') {
      fetchTeacherMaterials();
      fetchTeacherAttendanceSummary();
      fetchTeacherClassAttendance();
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

  const fetchTeacherMaterials = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/classes/${classId}/teacher-materials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeacherMaterials(data.materials || []);
      }
    } catch (error) {
      console.error('Error fetching teacher materials:', error);
    }
  };

  const fetchTeacherAttendanceSummary = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/classes/${classId}/teacher-attendance-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeacherAttendanceSummary(data.summary || []);
      }
    } catch (error) {
      console.error('Error fetching teacher attendance summary:', error);
    }
  };

  const fetchTeacherClassAttendance = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/classes/${classId}/teacher-class-attendance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Convert to map by date
        const attendanceMap: { [key: string]: TeacherClassAttendance } = {};
        (data.attendance || []).forEach((att: TeacherClassAttendance) => {
          const dateKey = att.attendance_date.split('T')[0];
          attendanceMap[dateKey] = att;
        });
        setTeacherClassAttendance(attendanceMap);
      }
    } catch (error) {
      console.error('Error fetching teacher class attendance:', error);
    }
  };

  const exportAttendanceToExcel = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/classes/${classId}/export-attendance?month=${exportMonth}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const className = classData?.name || 'Kelas';
        a.download = `Rekap_Absensi_${className}_${exportMonth}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal mengexport data absensi');
      }
    } catch (error) {
      console.error('Error exporting attendance:', error);
      alert('Terjadi kesalahan saat mengexport data');
    } finally {
      setIsExporting(false);
    }
  };

  const saveTeacherClassAttendance = async (date: string, status: string) => {
    setSavingTeacherAttendance(date);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/classes/${classId}/teacher-class-attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance_date: date,
          status: status,
          notes: ''
        }),
      });

      if (response.ok) {
        // Update local state
        setTeacherClassAttendance(prev => ({
          ...prev,
          [date]: {
            ...prev[date],
            attendance_date: date,
            status: status
          } as TeacherClassAttendance
        }));
        alert('Status kehadiran guru berhasil disimpan');
      } else {
        alert('Gagal menyimpan status kehadiran guru');
      }
    } catch (error) {
      console.error('Error saving teacher class attendance:', error);
      alert('Terjadi kesalahan');
    } finally {
      setSavingTeacherAttendance(null);
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
            <button
              onClick={() => setActiveTab('teacher-materials')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'teacher-materials'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📚 Materi & Absen Guru
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
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Pilih Tanggal:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  
                  {/* Export Section */}
                  <div className="flex items-end gap-2">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Export Rekap Bulanan:</label>
                      <input
                        type="month"
                        value={exportMonth}
                        onChange={(e) => setExportMonth(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                    </div>
                    <button
                      onClick={exportAttendanceToExcel}
                      disabled={isExporting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isExporting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Mengexport...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download Excel</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Info about data source */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <span className="text-blue-600">ℹ️</span>
                  <div>
                    <span className="text-sm text-blue-800 font-medium">Data absensi diinput oleh guru</span>
                    <p className="text-xs text-blue-700 mt-1">Admin hanya bisa melihat data absensi yang diinput guru melalui Portal Guru. Untuk mengubah status, hubungi guru terkait.</p>
                  </div>
                </div>

                {Object.keys(attendanceData).length > 0 && Object.values(attendanceData).some(att => att.id) ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nama Santri</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student, index) => {
                          const studentAtt = attendanceData[student.id];
                          const hasData = studentAtt?.id;
                          
                          // Map status to display
                          const statusDisplay = {
                            'present': { label: 'Hadir', icon: '✅', bg: 'bg-green-100', text: 'text-green-800' },
                            'Hadir': { label: 'Hadir', icon: '✅', bg: 'bg-green-100', text: 'text-green-800' },
                            'absent': { label: 'Alfa', icon: '❌', bg: 'bg-red-100', text: 'text-red-800' },
                            'Alpha': { label: 'Alfa', icon: '❌', bg: 'bg-red-100', text: 'text-red-800' },
                            'Alfa': { label: 'Alfa', icon: '❌', bg: 'bg-red-100', text: 'text-red-800' },
                            'sick': { label: 'Sakit', icon: '🏥', bg: 'bg-yellow-100', text: 'text-yellow-800' },
                            'Sakit': { label: 'Sakit', icon: '🏥', bg: 'bg-yellow-100', text: 'text-yellow-800' },
                            'permission': { label: 'Izin', icon: '📝', bg: 'bg-blue-100', text: 'text-blue-800' },
                            'Izin': { label: 'Izin', icon: '📝', bg: 'bg-blue-100', text: 'text-blue-800' },
                          };
                          
                          const status = statusDisplay[studentAtt?.status as keyof typeof statusDisplay] || { label: '-', icon: '❓', bg: 'bg-gray-100', text: 'text-gray-800' };
                          
                          return (
                            <tr key={student.id} className={hasData ? 'bg-green-50' : ''}>
                              <td className="px-4 py-3 text-sm text-black">{index + 1}</td>
                              <td className="px-4 py-3 text-sm font-medium text-black">
                                {student.name}
                              </td>
                              <td className="px-4 py-3">
                                {hasData ? (
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                    {status.icon} {status.label}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-sm">Belum diabsen</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {studentAtt?.notes || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">Belum ada data absensi untuk tanggal ini</p>
                    <p className="text-sm mt-1">Data akan muncul setelah guru menginput absensi melalui Portal Guru</p>
                  </div>
                )}
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

            {/* Teacher Materials Tab */}
            {activeTab === 'teacher-materials' && (
              <div className="space-y-6">
                {/* Section: Teacher Submitted Materials */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📚</span>
                    Materi yang Diinput Guru
                  </h3>
                  
                  {teacherMaterials.length > 0 ? (
                    <div className="space-y-3">
                      {teacherMaterials.map((material) => (
                        <div key={material.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{material.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                            </div>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                              {new Date(material.material_date).toLocaleDateString('id-ID', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="font-medium">Belum ada materi yang diinput guru</p>
                      <p className="text-sm mt-1">Materi akan muncul setelah guru menginput melalui Portal Guru</p>
                    </div>
                  )}
                </div>

                {/* Section: Teacher Attendance Summary */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Rekap Absensi Santri (Input Guru)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Data absensi yang diinput oleh guru melalui Portal Guru. Admin dapat menggunakan data ini untuk menentukan kehadiran guru.
                  </p>
                  
                  {teacherAttendanceSummary.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-green-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tanggal</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-green-700 uppercase">Hadir</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-blue-700 uppercase">Izin</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-yellow-700 uppercase">Sakit</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-red-700 uppercase">Alfa</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Total</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Status Guru</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {teacherAttendanceSummary.map((summary, index) => {
                            const dateKey = summary.date.split('T')[0];
                            const confirmedStatus = teacherClassAttendance[dateKey]?.status;
                            const isSaving = savingTeacherAttendance === dateKey;
                            
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {new Date(summary.date).toLocaleDateString('id-ID', { 
                                    weekday: 'short',
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    {summary.hadir}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {summary.izin}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                                    {summary.sakit}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                    {summary.alfa}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                                  {summary.total}
                                </td>
                                <td className="px-4 py-3">
                                  {confirmedStatus ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        confirmedStatus === 'hadir' ? 'bg-green-500 text-white' :
                                        confirmedStatus === 'izin' ? 'bg-blue-500 text-white' :
                                        confirmedStatus === 'sakit' ? 'bg-yellow-500 text-white' :
                                        'bg-red-500 text-white'
                                      }`}>
                                        {confirmedStatus === 'hadir' ? '✓ Hadir' :
                                         confirmedStatus === 'izin' ? '📝 Izin' :
                                         confirmedStatus === 'sakit' ? '🏥 Sakit' : '✗ Alfa'}
                                      </span>
                                      <button
                                        onClick={() => {
                                          if (confirm('Ubah status kehadiran guru?')) {
                                            setTeacherClassAttendance(prev => {
                                              const newState = { ...prev };
                                              delete newState[dateKey];
                                              return newState;
                                            });
                                          }
                                        }}
                                        className="text-gray-400 hover:text-gray-600 text-xs"
                                        title="Ubah status"
                                      >
                                        ✏️
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-1">
                                      {isSaving ? (
                                        <span className="text-gray-500 text-xs">Menyimpan...</span>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => saveTeacherClassAttendance(dateKey, 'hadir')}
                                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors"
                                            title="Konfirmasi Hadir"
                                          >
                                            Hadir
                                          </button>
                                          <button
                                            onClick={() => saveTeacherClassAttendance(dateKey, 'izin')}
                                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                                            title="Konfirmasi Izin"
                                          >
                                            Izin
                                          </button>
                                          <button
                                            onClick={() => saveTeacherClassAttendance(dateKey, 'sakit')}
                                            className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-medium transition-colors"
                                            title="Konfirmasi Sakit"
                                          >
                                            Sakit
                                          </button>
                                          <button
                                            onClick={() => saveTeacherClassAttendance(dateKey, 'alfa')}
                                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                                            title="Konfirmasi Alfa"
                                          >
                                            Alfa
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium">Belum ada data absensi dari guru</p>
                      <p className="text-sm mt-1">Data akan muncul setelah guru menginput absensi melalui Portal Guru</p>
                    </div>
                  )}
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
