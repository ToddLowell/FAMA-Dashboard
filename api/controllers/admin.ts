import fs from 'fs';
import path from 'path';
import parse from 'csv-parse/lib/sync';
import stringify from 'csv-stringify';
import type { RequestHandler } from 'express';

// [username, isAdmin]
type row = [string, '0' | '1'];

enum File {
  Usernames = '../files/valid_usernames.csv',
}

const readRecordsFile = () => {
  const usernames = fs.readFileSync(
    path.join(__dirname, File.Usernames),
    'utf8'
  );

  const records: row[] = parse(usernames);

  return records;
};

const writeRecordsFile = (output: string, cb: fs.NoParamCallback) => {
  fs.writeFile(path.join(__dirname, File.Usernames), output, cb);
};

export const verifyUsername = (username: string) => {
  const records = readRecordsFile();

  return records.find((el) => el[0] === username);
};

export const addRow: RequestHandler<
  {},
  {},
  { username: string; isAdmin: '0' | '1' }
> = (req, res) => {
  const { username, isAdmin } = req.body;
  const records = readRecordsFile();

  // validate req
  if (isAdmin !== '0' && isAdmin !== '1')
    return res.status(400).json({ message: 'isAdmin must be 0 or 1' });
  if (records.map((x) => x[0]).includes(username))
    return res.status(400).json({ message: 'username already exists' });

  // add row
  records.push([username, isAdmin]);

  // write file
  stringify(records, (err, output) => {
    if (err) return res.status(500).json({ message: err.message });
    writeRecordsFile(output, (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Entry Added' });
    });
  });
};

export const removeRow: RequestHandler<{}, {}, {}, { username: string }> = (
  req,
  res
) => {
  let records = readRecordsFile();

  // remove row
  records = records.filter((record) => record[0] !== req.query.username);

  // write file
  stringify(records, (err, output) => {
    if (err) return res.status(500).json({ message: err.message });
    writeRecordsFile(output, (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: 'Entry Removed' });
    });
  });
};

export const updateRow: RequestHandler<
  {},
  {},
  { username: string; isAdmin: '0' | '1' }
> = (req, res) => {
  const { username, isAdmin } = req.body;
  let records = readRecordsFile();

  // validate req
  if (isAdmin !== '0' && isAdmin !== '1')
    return res.status(400).json({ message: 'isAdmin must be 0 or 1' });
  if (!records.map((x) => x[0]).includes(username))
    return res.status(400).json({ message: 'username does not exist' });

  // update row
  records = records.map((record) =>
    record[0] === username ? [username, isAdmin] : record
  );

  // write file
  stringify(records, (err, output) => {
    if (err) return res.status(500).json({ message: err.message });
    writeRecordsFile(output, (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: 'Entry Edited' });
    });
  });
};
