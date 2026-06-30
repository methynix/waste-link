import { graphql } from "./api";
import type { Transaction, Wallet } from "@/types";

export interface DepositResult {
  depositId: string;
  message: string;
}

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

export async function initiateDeposit(
  amount: string,
  mobileMoneyNumber: string
): Promise<DepositResult> {
  const data = await graphql<{ initiateDeposit: DepositResult }>(
    `mutation ($amount: Decimal!, $mobileMoneyNumber: String!) {
      initiateDeposit(amount: $amount, mobileMoneyNumber: $mobileMoneyNumber) {
        depositId
        message
      }
    }`,
    { amount, mobileMoneyNumber }
  );
  return data.initiateDeposit;
}
