//this was run once to insert data into the database 

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const insertData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const studentInsertQuery = `
      INSERT INTO student (name) VALUES 
      ('John Doe'), ('Jane Smith'), ('Alice Johnson'), ('Bob Brown'), ('Charlie Davis'),
      ('David Evans'), ('Eva Green'), ('Frank Harris'), ('Grace Lee'), ('Hank Miller'),
      ('Ivy Nelson'), ('Jack Owens'), ('Kara Peterson'), ('Liam Quinn'), ('Mia Roberts'),
      ('Nina Scott'), ('Oscar Turner'), ('Paul Underwood'), ('Quinn Vance'), ('Rita White')
      RETURNING id;
    `;
    const studentResult = await client.query(studentInsertQuery);
    const studentIds = studentResult.rows.map(row => row.id);

    const courseInsertQuery = `
      INSERT INTO course (name) VALUES 
      ('Math'), ('Science'), ('History'), ('Art'), ('Music'),
      ('Physical Education'), ('Biology'), ('Chemistry'), ('Physics'), ('Literature'),
      ('Geography'), ('Economics'), ('Psychology'), ('Sociology'), ('Philosophy'),
      ('Political Science'), ('Computer Science'), ('Engineering'), ('Medicine'), ('Law')
      RETURNING id;
    `;
    const courseResult = await client.query(courseInsertQuery);
    const courseIds = courseResult.rows.map(row => row.id);

    const scoreInsertQuery = `
      INSERT INTO score (student_id, course_id, score) VALUES 
      ${studentIds.map(studentId => 
        courseIds.map(courseId => 
          `(${studentId}, ${courseId}, ${Math.floor(Math.random() * 101)})`
        ).join(', ')
      ).join(', ')}
    `;
    await client.query(scoreInsertQuery);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error! ', error);
  } finally {
    client.release();
  }
};

insertData().catch(console.error);