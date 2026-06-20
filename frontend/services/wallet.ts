import { graphql } from "./api";
import type { Transaction, Wallet } from "@/types";

export async function myWallet(): Promise<Wallet> {
  const data = await graphql<{ myWallet: Wallet }>(
    `query { myWallet { id balance held totalEarned totalWithdrawn } }`
  );
  return data.myWallet;
}

export async function myTransactions(): Promise<Transaction[]> {
  const data = await graphql<{ myTransactions: Transaction[] }>(
    `query { myTransactions { id transactionType amount reference status createdAt } }`
  );
  return data.myTransactions;
}

export async function requestWithdrawal(
  amount: string,
  mobileMoneyNumber: string
): Promise<void> {
  await graphql(
    `mutation ($amount: Decimal!, $mobileMoneyNumber: String!) {
      requestWithdrawal(amount: $amount, mobileMoneyNumber: $mobileMoneyNumber) {
        withdrawal { id status }
      }
    }`,
    { amount, mobileMoneyNumber }
  );
}
