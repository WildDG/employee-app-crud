export function validateEmployee(body) {
  const { name, position, salary } = body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'Name is required';
  }

  if (!position || typeof position !== 'string' || position.trim() === '') {
    return 'Position is required';
  }

  if (salary === undefined || salary === null) {
    return 'Salary is required';
  }

  if (isNaN(salary)) {
    return 'Salary must be a number';
  }

  if (Number(salary) <= 0) {
    return 'Salary must be greater than 0';
  }

  return null;
}
