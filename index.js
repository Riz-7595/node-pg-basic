import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const getTotalScoreByStudent = async () => {
  const res = await pool.query(`
    SELECT student.name, SUM(score.score) AS total_score
    FROM score
    JOIN student ON score.student_id = student.id
    GROUP BY student.name
  `);
  return res.rows;
};

const getPercentageScoreByStudent = async () => {
  const res = await pool.query(`
    SELECT student.name, ROUND(AVG(score.score),2) AS percentage_score
    FROM score
    JOIN student ON score.student_id = student.id
    GROUP BY student.name
  `);
  return res.rows;
};

const getHighestScoreByCourse = async () => {
  const res = await pool.query(`
    SELECT DISTINCT ON (course.name) course.name AS course_name, score.score AS highest_score, student.name AS student_name
    FROM score
    JOIN course ON score.course_id = course.id
    JOIN student ON score.student_id = student.id
    ORDER BY course.name, score.score DESC
  `);
  return res.rows;
};

let totalScore = await getTotalScoreByStudent();
let percentageScore = await getPercentageScoreByStudent();
let highestScore = await getHighestScoreByCourse();

console.log('Total Score of Students: (out of 2000)');
console.table(totalScore);
console.log('Percentage of Students:');
console.table(percentageScore);
console.log('Highest Score in Courses (out of 100):');
console.table(highestScore);

pool.end();