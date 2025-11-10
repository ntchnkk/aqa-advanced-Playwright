export const invalidPasswords = [
  {
    value: "12345Pw",
    scenario: "too short password",
  },
  {
    value: "Aa92".repeat(4),
    scenario: "too long password",
  },
  {
    value: "password123456",
    scenario: "password with no uppercase letter",
  },
  {
    value: "PASSWORD12",
    scenario: "password with no lowercase letter",
  },
  {
    value: "Password",
    scenario: "password with no numbers",
  },
];
