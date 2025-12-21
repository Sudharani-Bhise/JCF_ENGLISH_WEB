const KEY = "jcf_enquiries";

// get all enquiries
export const getEnquiries = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

// add enquiry
export const addEnquiry = (data) => {
  const old = getEnquiries();
  const updated = [
    ...old,
    {
      id: Date.now(),
      ...data,
      createdAt: new Date().toLocaleString(),
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(updated));
};

// delete enquiry
export const deleteEnquiry = (id) => {
  const filtered = getEnquiries().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(filtered));
};