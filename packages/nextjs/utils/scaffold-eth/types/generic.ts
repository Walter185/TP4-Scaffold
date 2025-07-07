export type ContractDeclaration = {
  address: string;
  abi: any;
};

export type GenericContractsDeclaration = {
  [chainId: number]: {
    [contractName: string]: ContractDeclaration;
  };
};
