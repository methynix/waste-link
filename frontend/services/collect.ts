import { graphql } from "./api";
import type { CollectionJob, JobStatus, Volume, WasteType } from "@/types";

const JOB_FIELDS = `
  id wasteType volume pickupAddress preferredTime status paymentStatus
  estimatedPrice finalPrice createdAt
`;

export interface CreatePickupInput {
  wasteType: WasteType;
  volume: Volume;
  preferredTime: string;
  pickupAddress: string;
  latitude?: number;
  longitude?: number;
}

export async function estimatePickup(
  wasteType: WasteType,
  volume: Volume
): Promise<string> {
  const data = await graphql<{ estimatePickup: string }>(
    `query ($wasteType: String!, $volume: String!) {
      estimatePickup(wasteType: $wasteType, volume: $volume)
    }`,
    { wasteType, volume }
  );
  return data.estimatePickup;
}

export async function createPickup(
  input: CreatePickupInput
): Promise<CollectionJob> {
  const data = await graphql<{ createPickup: { job: CollectionJob } }>(
    `mutation ($wasteType: String!, $volume: String!, $preferredTime: DateTime!, $pickupAddress: String!, $latitude: Float, $longitude: Float) {
      createPickup(wasteType: $wasteType, volume: $volume, preferredTime: $preferredTime, pickupAddress: $pickupAddress, latitude: $latitude, longitude: $longitude) {
        job { ${JOB_FIELDS} }
      }
    }`,
    input as unknown as Record<string, unknown>
  );
  return data.createPickup.job;
}

export async function myJobs(): Promise<CollectionJob[]> {
  const data = await graphql<{ myJobs: CollectionJob[] }>(
    `query { myJobs { ${JOB_FIELDS} } }`
  );
  return data.myJobs;
}

export async function openJobs(): Promise<CollectionJob[]> {
  const data = await graphql<{ openJobs: CollectionJob[] }>(
    `query { openJobs { ${JOB_FIELDS} } }`
  );
  return data.openJobs;
}

export async function assignedJobs(): Promise<CollectionJob[]> {
  const data = await graphql<{ assignedJobs: CollectionJob[] }>(
    `query { assignedJobs { ${JOB_FIELDS} } }`
  );
  return data.assignedJobs;
}

export async function acceptJob(jobId: string): Promise<CollectionJob> {
  const data = await graphql<{ acceptJob: { job: CollectionJob } }>(
    `mutation ($jobId: UUID!) { acceptJob(jobId: $jobId) { job { ${JOB_FIELDS} } } }`,
    { jobId }
  );
  return data.acceptJob.job;
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus
): Promise<CollectionJob> {
  const data = await graphql<{ updateJobStatus: { job: CollectionJob } }>(
    `mutation ($jobId: UUID!, $status: String!) {
      updateJobStatus(jobId: $jobId, status: $status) { job { ${JOB_FIELDS} } }
    }`,
    { jobId, status }
  );
  return data.updateJobStatus.job;
}
