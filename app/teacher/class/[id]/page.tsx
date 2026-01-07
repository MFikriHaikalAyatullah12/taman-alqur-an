'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Student {
  id: number;
  name: string;
  parent_name: string;
  status: string;
}

interface ClassData {
  id: number;
  name: string;
  description: string;
  teacher_in_charge: string;
}

interface Attendance {
  student_id: number;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  notes: string;
}

interface Material {
  id?: number;
  title: string;
  description: string;
  material_date: string;
}

export default function TeacherClassPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'materials'>('students');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<{ [key: number]: Attendance }>({});
  const [materials, setMaterials] = useState<Material[]>([]);
  const [teacherName, setTeacherName] = useState('');

  // Add student form
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    parent_name: '',
    parent_phone: '',
    birth_place: '',
    birth_date: ''
  });
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  // Add material form
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    material_date: new Date().toISOString().split('T')[0]
  });
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  useEffect(() => {
    // Check if logged in and verified
    const accessToken = localStorage.getItem('teacher_access_token');
    const teacherNameStorage = localStorage.getItem('teacher_name');
    
    if (!accessToken) {
      router.push('/teacher/dashboard');
      return;
    }
    
    setTeacherName(teacherNameStorage || 'Guru');
    fetchClassData();
    fetchStudents();
  }, [classId, router]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    } else if (activeTab === 'materials') {
      fetchMaterials();
    }
  }, [activeTab, selectedDate]);

  const fetchClassData = async () => {
    try {
      const accessToken = localStorage.getItem('teacher_access_token');
      const response = await fetch(`/api/teacher/class/${classId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClassData(data.class);
      } else {
        router.push('/teacher/dashboard');
      }
    } catch (error) {
      console.error('Error fetching class:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const accessToken = localStorage.getItem('teacher_access_token');
      const response = await fetch(`/api/teacher/class/${classId}/students`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
      const accessToken = localStorage.getItem('teacher_access_token');
      const response = await fetch(`/api/teacher/class/${classId}/attendance?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const attendanceMap: { [key: number]: Attendance } = {};
        (data.attendance || []).forEach((att: any) => {
          attendanceMap[att.student_id] = {
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

  const fetchMaterials = async () => {
    try {
      const accessToken = localStorage.getItem('teacher_access_token');
      const response = await fetch(`/api/teacher/class/${classId}/materials`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMaterials(data.materials || []);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
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

  const saveAllAttendance = async () => {
    try {
      const accessToken = localStorage.getItem('teacher_access_token');
      const attendanceList = students.map(student => {
        const att = attendanceData[student.id] || { status: 'hadir', notes: '' };
        return {
          student_id: student.id,
          status: att.status || 'hadir',
          notes: att.notes || ''
        };
      });

      const response = await fetch(`/api/teacher/class/${classId}/attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance_date: selectedDate,
          attendance: attendanceList
        }),
      });

      if (response.ok) {
        alert('Absensi berhasil disimpan!');
        fetchAttendance();
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menyimpan absensi');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStudent(true);

    try {
      const accessToken = localStorage.getItem('teacher_access_token');
      const response = await fetch(`/api/teacher/class/${classId}/students`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudentForm),
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(prev => [...prev, data.student]);
        setShowAddStudentModal(false);
        setNewStudentForm({
          name: '',
          parent_name: '',
          parent_phone: '',
          birth_place: '',
          birth_date: ''
        });
        alert('Santri berhasil ditambahkan!');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menambahkan santri');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsSavingStudent(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMaterial(true);

    try {
      const accessToken = localStorage.getItem('teacher_access_token');
      const response = await fetch(`/api/teacher/class/${classId}/materials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialForm),
      });

      if (response.ok) {
        const data = await response.json();
        setMaterials(prev => [data.material, ...prev]);
        setShowAddMaterialModal(false);
        setMaterialForm({
          title: '',
          description: '',
          material_date: new Date().toISOString().split('T')[0]
        });
        alert('Materi berhasil ditambahkan!');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menambahkan materi');
      }
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const handleBack = () => {
    // Navigate back to dashboard - browser will maintain the state
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-black text-white drop-shadow-lg">{classData?.name || 'Kelas'}</h1>
                <p className="text-emerald-100 font-medium">Penanggung Jawab: {classData?.teacher_in_charge}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'students'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              👨‍🎓 Daftar Santri ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'attendance'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              📋 Absensi Harian
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'materials'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              📚 Materi
            </button>
          </div>
        </div>

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Daftar Santri</h2>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Santri
              </button>
            </div>

            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Santri</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Orang Tua</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.parent_name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            student.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {student.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="font-semibold">Belum ada santri di kelas ini</p>
                <p className="text-sm mt-1">Klik "Tambah Santri" untuk menambahkan santri baru</p>
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Absensi Harian</h2>
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                />
                <button
                  onClick={saveAllAttendance}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  💾 Simpan Absensi
                </button>
              </div>
            </div>

            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Santri</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status Kehadiran</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3">
                          <select
                            value={attendanceData[student.id]?.status || 'hadir'}
                            onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                          >
                            <option value="hadir">✅ Hadir</option>
                            <option value="izin">📝 Izin</option>
                            <option value="sakit">🤒 Sakit</option>
                            <option value="alfa">❌ Alfa</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={attendanceData[student.id]?.notes || ''}
                            onChange={(e) => handleAttendanceChange(student.id, 'notes', e.target.value)}
                            placeholder="Keterangan..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="font-semibold">Belum ada santri untuk diabsen</p>
                <p className="text-sm mt-1">Tambahkan santri terlebih dahulu</p>
              </div>
            )}
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Materi Pembelajaran</h2>
              <button
                onClick={() => setShowAddMaterialModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Materi
              </button>
            </div>

            {materials.length > 0 ? (
              <div className="space-y-4">
                {materials.map((material, index) => (
                  <div key={material.id || index} className="border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{material.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
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
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="font-semibold">Belum ada materi</p>
                <p className="text-sm mt-1">Klik "Tambah Materi" untuk menambahkan materi baru</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Santri Baru</h2>
            
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Santri *</label>
                <input
                  type="text"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Orang Tua *</label>
                <input
                  type="text"
                  value={newStudentForm.parent_name}
                  onChange={(e) => setNewStudentForm(prev => ({ ...prev, parent_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP Orang Tua</label>
                <input
                  type="tel"
                  value={newStudentForm.parent_phone}
                  onChange={(e) => setNewStudentForm(prev => ({ ...prev, parent_phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir *</label>
                  <input
                    type="text"
                    value={newStudentForm.birth_place}
                    onChange={(e) => setNewStudentForm(prev => ({ ...prev, birth_place: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    value={newStudentForm.birth_date}
                    onChange={(e) => setNewStudentForm(prev => ({ ...prev, birth_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingStudent}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
                >
                  {isSavingStudent ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Materi Baru</h2>
            
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi *</label>
                <input
                  type="text"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  placeholder="Contoh: Surat Al-Fatihah"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                <textarea
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  placeholder="Jelaskan materi yang diajarkan..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengajaran *</label>
                <input
                  type="date"
                  value={materialForm.material_date}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, material_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingMaterial}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
                >
                  {isSavingMaterial ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
