const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
// base url pake ip address ethernet (wifi)

export async function apiLogin(email, password) {
  const res = await fetch(`${BASE_URL}/api/account/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
        userEmail: email, 
        userPassword: password 
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Login gagal");
  }

  return data;
}
