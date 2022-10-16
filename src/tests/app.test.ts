describe('Setting Up Tests', () => {
  const testSetup: any = 'Test';

  beforeAll(async () => {
    jest.clearAllMocks();
  });

  it('successfully test setup', () => {
    expect(testSetup).toEqual('Test');
  });
});
