import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { generateRegistrationNumber } from '@/lib/types';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Generate registration number
    const registrationNumber = generateRegistrationNumber();
    
    // Insert registration data
    const result = await pool.query(`
      INSERT INTO student_registrations (
        registration_number, full_name, birth_date, birth_place, gender,
        parent_name, parent_phone, parent_email, address, previous_education,
        documents, status, notes, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *
    `, [
      registrationNumber,
      formData.full_name,
      formData.birth_date,
      formData.birth_place,
      formData.gender,
      formData.parent_name,
      formData.parent_phone,
      formData.parent_email || null,
      formData.address,
      formData.previous_education || null,
      JSON.stringify({
        nick_name: formData.nick_name,
        parent_occupation: formData.parent_occupation,
        emergency_contact: {
          name: formData.emergency_contact_name,
          phone: formData.emergency_contact_phone,
          relation: formData.emergency_contact_relation
        },
        health_info: {
          conditions: formData.health_conditions,
          allergies: formData.allergies,
          medications: formData.medications
        },
        program_preferences: {
          desired_program: formData.desired_program,
          preferred_schedule: formData.preferred_schedule
        },
        additional_info: {
          motivation: formData.motivation,
          previous_islamic_education: formData.previous_islamic_education,
          special_needs: formData.special_needs
        }
      }),
      'pending',
      'Pendaftaran melalui website'
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil disimpan',
      registration_number: registrationNumber,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = 'SELECT * FROM student_registrations';
    let params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      registrations: result.rows,
      total: result.rowCount
    });
    
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}