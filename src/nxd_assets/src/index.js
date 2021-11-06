import { nxd } from "../../declarations/nxd";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with nxd actor, calling the greet method
  const greeting = await nxd.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
