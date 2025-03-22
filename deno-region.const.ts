export const DenoRegion = {
  Singapore: "asia-southeast1",
  London: "europe-west2",
  Frankfurt: "europe-west3",
  "Sao Paolo": "southamerica-east1",
  "North Virginia": "us-east4",
  California: "us-west2",
};

export type DenoRegion = typeof DenoRegion[keyof typeof DenoRegion];
