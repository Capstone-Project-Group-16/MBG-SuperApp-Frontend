// base url pake ip address ethernet (wifi)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// help fetch
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "API error");
    }

    return await res.json();
  } catch (err) {
    console.error("API Fetch Error:", err);
    throw err;
  }
}

// START INTEGRATE ALL CATERING'S FEATURES

// login
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

// list provinsi (filtering button)
export async function getProvinces() {
  const data = await fetchAPI("/api/location/list");

  const provinces = [];

  const seen = new Set();

  data.forEach((item) => {
    if (!seen.has(item.province)) {
      provinces.push({
        province: item.province,
        locationId: item.locationId, // if needed later
      });
      seen.add(item.province);
    }
  });

  return provinces;
}

// list sekolah (filtering button)
export async function getSchools() {
  const data = await fetchAPI("/api/school/list");

  return data.map((school) => ({
    schoolId: school.schoolId,
    schoolName: school.schoolName,
    schoolLocationId: school.schoolLocationId, // for province filtering
  }));
}

// list makanan
export async function getFoodList() {
  const data = await fetchAPI("/api/food/list");

  return data.map((food) => ({
    foodId: food.foodId,
    foodName: food.foodName,
  }));
}

// list murid berdasarkan sekolah
export async function getStudentsBySchool(schoolId) {
  const data = await fetchAPI(
    `/api/account/student-profile/by-school/${schoolId}`
  );

  return data.map((student) => ({
    userId: student.user.userId,
    schoolId: student.schoolId,
    userFullName: student.user.userFullName,
  }));
}

// placeholder status masakan
export const cookingStatus = [
  { label: "Complete", value: "Complete" },
  { label: "Incomplete", value: "Incomplete" },
];


