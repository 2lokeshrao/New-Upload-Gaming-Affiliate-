const array = ["a"];
try {
  const result = array?.split(',')[0];
  console.log(result);
} catch (e) {
  console.log("Error:", e);
}
