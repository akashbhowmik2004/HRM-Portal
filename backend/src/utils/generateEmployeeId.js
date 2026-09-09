import Employee from "../models/Employee.js";
export const generateEmployeeId = async () => {
  let employeeId;
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    employeeId = `EMP${randomNumber}`;

    exists = await Employee.exists({
      employeeId,
    });
  }
  console.log("Generated Employee ID:", employeeId);

  return employeeId;
};