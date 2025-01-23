export const up = (pgm) => {
  pgm.createTable('student', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
  });

  pgm.createTable('course', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
  });

  pgm.createTable('score', {
    id: 'id',
    student_id: {
      type: 'integer',
      notNull: true,
      references: '"student"',
      onDelete: 'cascade'
    },
    course_id: {
      type: 'integer',
      notNull: true,
      references: '"course"',
      onDelete: 'cascade'
    },
    score: { type: 'integer', notNull: true }
  });
};

export const down = (pgm) => {
  pgm.dropTable('score');
  pgm.dropTable('course');
  pgm.dropTable('student');
};