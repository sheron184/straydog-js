import Database, { Statement } from 'better-sqlite3';
import path from 'path';

export class BaseModel {
  public db;
  public _table: string;

  constructor(table: string) {
    const dbPath = path.resolve(__dirname, 'db.sqlite3');
    this.db = new Database(dbPath);
    this._table = table; 
  }

  init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS request (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        method TEXT,
        path TEXT,
        query TEXT,
        body TEXT,
        headers TEXT,
        start_time DATETIME
      );
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS response (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER,
        body TEXT,
        end_time DATETIME,
        status_code INTEGER,
        error TEXT,
        latency INTEGER,
        error_stack TEXT
      );
    `);
  }

  set table(table: string) {
    this._table = table;
  }

  insert(data: Record<string, any>): number {
    if (!this._table) throw new Error('Table name is not set.');

    const columns = Object.keys(data);
    const values = Object.values(data);

    if (columns.length === 0) throw new Error('Data object must have at least one property.');

    const placeholders = columns.map(() => '?').join(', ');
    const cols = columns.map(col => `"${col}"`).join(', ');
    const sql = `INSERT INTO "${this._table}" (${cols}) VALUES (${placeholders})`;

    const stmt: Statement = this.db.prepare(sql);
    const result = stmt.run(...values);

    return result.lastInsertRowid as number;
  }


  update(data: Record<string, any>, where: Record<string, any>): void {
    if (!this._table) throw new Error('Table name is not set.');

    const setCols = Object.keys(data);
    const setValues = Object.values(data);

    if (setCols.length === 0) throw new Error('Update data must have at least one property.');

    const whereCols = Object.keys(where);
    const whereValues = Object.values(where);

    if (whereCols.length === 0) throw new Error('Where condition must have at least one property.');

    const setClause = setCols.map(col => `"${col}" = ?`).join(', ');
    const whereClause = whereCols.map(col => `"${col}" = ?`).join(' AND ');

    const sql = `UPDATE "${this._table}" SET ${setClause} WHERE ${whereClause}`;

    const stmt: Statement = this.db.prepare(sql);
    stmt.run(...setValues, ...whereValues);
  }

  delete(where: Record<string, any>): void {
    if (!this._table) throw new Error('Table name is not set.');

    const whereCols = Object.keys(where);
    const whereValues = Object.values(where);

    if (whereCols.length === 0) throw new Error('Where condition must have at least one property.');

    const whereClause = whereCols.map(col => `"${col}" = ?`).join(' AND ');

    const sql = `DELETE FROM "${this._table}" WHERE ${whereClause}`;

    const stmt: Statement = this.db.prepare(sql);
    stmt.run(...whereValues);
  }

  /**
   * Get all rows from the table
   */
  getAll<T = Record<string, any>>(): T[] {
    if (!this._table) throw new Error('Table name is not set.');

    const sql = `SELECT * FROM "${this._table}"`;
    const stmt: Statement = this.db.prepare(sql);
    return stmt.all() as T[];
  }

  /**
   * Find rows by any column(s) with AND condition
   * @param where - object of column-value pairs
   */
  find<T = Record<string, any>>(where: Record<string, any>): T[] {
    if (!this._table) throw new Error('Table name is not set.');

    const whereCols = Object.keys(where);
    const whereValues = Object.values(where);

    if (whereCols.length === 0) throw new Error('Where condition must have at least one property.');

    const whereClause = whereCols.map(col => `"${col}" = ?`).join(' AND ');

    const sql = `SELECT * FROM "${this._table}" WHERE ${whereClause}`;
    const stmt: Statement = this.db.prepare(sql);
    return stmt.all(...whereValues) as T[];
  }

  /**
 * Get records from the last N days based on a date column
 * @param dateColumn - the column name that contains the date/datetime
 * @param days - number of days to look back
 * @param additionalWhere - optional additional where conditions
 * @param orderBy - optional order by column (defaults to dateColumn DESC)
 */
  getLastNDays<T = Record<string, any>>(
    dateColumn: string, 
    days: number, 
    additionalWhere?: Record<string, any>,
    orderBy?: string
  ): T[] {
    if (!this._table) throw new Error('Table name is not set.');
    if (days < 0) throw new Error('Days must be a positive number.');

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0); // Start of day for more predictable results
  
    // For SQLite, we need to format the date properly
    const cutoffDateStr = cutoffDate.toISOString();

    let whereClause = `"${dateColumn}" >= ?`;
    let values: any[] = [cutoffDateStr];

    // Add additional where conditions if provided
    if (additionalWhere && Object.keys(additionalWhere).length > 0) {
      const additionalCols = Object.keys(additionalWhere);
      const additionalClause = additionalCols.map(col => `"${col}" = ?`).join(' AND ');
      whereClause += ` AND ${additionalClause}`;
      values.push(...Object.values(additionalWhere));
    }

    // Add ORDER BY clause
    const orderByClause = orderBy || `"${dateColumn}" DESC`;

    const sql = `SELECT * FROM "${this._table}" WHERE ${whereClause} ORDER BY ${orderByClause}`;
  
    const stmt: Statement = this.db.prepare(sql);
    return stmt.all(...values) as T[];
  }
}
