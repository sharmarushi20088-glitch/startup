export function isValidCollegeEmail(email) {
  const domains = ["nith.ac.in", "student.nith.ac.in", "college.edu.in"];
  const e = String(email || "").toLowerCase();
  return domains.some((d) => e.endsWith(d));
}
