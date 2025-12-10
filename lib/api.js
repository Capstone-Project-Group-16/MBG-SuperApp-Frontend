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

// generate pickup schedule (buat delivery)
export async function createDeliverySchedule(cateringId, pickUpDate, pickUpTime) {
  return await fetchAPI("/api/generate-catering-pickup-schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cateringId,
      pickUpDate, // di fe belum dibuat
      pickUpTime,
    }),
  });
}

// get driver by profile id
export async function getDriverById(driverProfileId) {
  const data = await fetchAPI(
    `/api/account/driver-profile/get/${driverProfileId}`
  );

  return {
    driverProfileId: data.driverProfileId,
    userId: data.user.userId,
    userFullName: data.user.userFullName,
    cateringId: data.cateringId,
  };
}

// placeholder (because API final belum ada)
export async function getDeliveryListByCatering(cateringId) {
  return [
    {
      deliveryId: 101,
      schoolName: "SMK 1 Jakarta",
      totalFoodToBeDelivered: 150,
      pickUpDate: "25-11-2025",
      pickUpTime: "08:30",
      cateringId,
    }
  ];
}

// placeholder karena API khusus belum tersedia
export async function getDeliveryDetail(deliveryId) {
  return {
    deliveryId,
    schoolName: "SDN 1 Depok",
    driverName: "Agus",
    totalFoodToBeDelivered: 150,
    pickUpTime: "08:30",
    pickUpDate: "25-11-2025",
  };
}

// placholder status delivery
export const deliveryStatus = [
  { label: "Ongoing", value: "Ongoing" },
  { label: "Complete", value: "Complete" },
];

// list menu mbg
export async function getMbgList() {
  const data = await fetchAPI("/api/food/list");

  return (data || []).map((food) => ({
    foodId: food.foodId,
    foodName: food.foodName,
    cateringId: food.cateringId,
    foodSupplyDate: food.foodSupplyDate,
    foodStock: food.foodStock,
    foodOrdered: food.foodOrdered,
    foodPrice: food.foodPrice,
    foodImageLink: food.foodImageLink,
    foodNutritionId: food.foodNutritionId,
    nutrition: food.nutrition || null,
  }));
}

// nutrition list
export async function getNutritionList() {
  const data = await fetchAPI("/api/food/nutrition/list");

  return (data || []).map((n) => ({
    nutritionId: n.nutritionId,
    full: n,
  }));
}

// add menu
export async function createMenu(payload) {
  return await fetchAPI("/api/food-supply/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// update (edit) menu
export async function updateMenu(foodId, payload) {
  return await fetchAPI(`/api/food-supply/edit/${foodId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// upload image
export async function uploadFoodImage(foodId, uri, fileName) {
  try {
    const formData = new FormData();

    // infer filename & mime type
    const inferredName = fileName || uri.split("/").pop() || `photo_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(inferredName);
    const ext = match ? match[1].toLowerCase() : "jpg";
    const mime = ext === "png" ? "image/png" : "image/jpeg";

    formData.append("file", {
      uri,
      name: inferredName,
      type: mime,
    });

    const res = await fetch(`${BASE_URL}/api/storage/addFoodPicture/${foodId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Upload failed");
    }

    return await res.json();
  } catch (err) {
    console.error("UploadFoodImage Error:", err);
    throw err;
  }
}
