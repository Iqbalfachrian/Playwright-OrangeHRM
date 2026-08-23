// import { expect } from "@playwright/test";

// interface TransactionResponse {
//   id: string;
//   amount: number;
//   status: "pending" | "completed" | "failed";
//   channel?: "mobile" | "web" | "atm";
// }

// async function demoTransactionAssertions(response: { json: () => Promise<unknown> }) {
//   // 1
//   const tx1 = (await response.json()) as TransactionResponse;
//   expect(tx1.status === "completed").toBe(true);

//   // 2
//   const tx2 = (await response.json()) as TransactionResponse;
//   expect(tx2.channel?.toUpperCase()).toBe("MOBILE");

//   // 3
//   const raw = await response.json();
//   if (
//     typeof raw === "object" &&
//     raw !== null &&
//     "status" in raw &&
//     typeof raw.status === "string" &&
//     ["pending", "completed", "failed"].includes(raw.status)
//   ) {
//     const tx3 = raw as TransactionResponse;
//     expect(tx3.status).toBe("completed");
//   } else {
//     throw new Error("response tidak sesuai kontrak TransactionResponse");
//   }

//   // 4
//   const tx4 = (await response.json()) as TransactionResponse;
//   expect(tx4.channel?.toUpperCase()).toBe("mobile");
// }

// export {};

// //-------------------------------------

console.log('1: Test dimulai');

async function simulateLogin() {
  console.log('2: Mengisi form login..')


await new Promise<void>(resolve => {
  console.log('3: click tombol login (executor sync)');
  setTimeout(() => resolve(), 0);
});
  console.log('4: Login selesai, menunggu dashboard');
}

simulateLogin();

setTimeout(() => {
  console.log('5: waitForResponse dipasang (TERLAMBAT!)');
}, 0)

Promise.resolve().then(() => {
  console.log('6: microtask scheduling preparation')
})

console.log('7: test function selesai di eksekusi')