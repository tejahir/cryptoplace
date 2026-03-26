import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const dataDirectory = path.resolve('server', 'data');
const usersFilePath = path.join(dataDirectory, 'users.json');

let writeQueue = Promise.resolve();

const ensureUsersFile = async () => {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(usersFilePath);
  } catch {
    await fs.writeFile(usersFilePath, '[]', 'utf8');
  }
};

const readUsers = async () => {
  await ensureUsersFile();
  const rawFile = await fs.readFile(usersFilePath, 'utf8');

  try {
    const parsed = JSON.parse(rawFile);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeUsers = async (users) => {
  writeQueue = writeQueue.then(() =>
    fs.writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}\n`, 'utf8'),
  );

  return writeQueue;
};

export const findUserByEmail = async (email) => {
  const users = await readUsers();
  return users.find((user) => user.email === email.toLowerCase()) || null;
};

export const findUserById = async (id) => {
  const users = await readUsers();
  return users.find((user) => user.id === id) || null;
};

export const createUser = async ({ name, email, passwordHash }) => {
  const users = await readUsers();

  const user = {
    id: randomUUID(),
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  return user;
};
