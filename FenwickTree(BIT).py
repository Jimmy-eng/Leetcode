class BIT:
    """
    Binary Indexed Tree (Fenwick Tree) class.

    Attributes:
        N: Size of the original array.
        bitArr: A list to store the Fenwick Tree array (1-indexed).
        nums: The original array of numbers (optional).
        M: Modulo value for calculations (default: 1e9 + 7).

    Methods:
        init(N): Initializes the BIT with size N.
        updateDelta(i, delta): Updates the value at index 'i' in the original array by 'delta'.
        queryPreSum(idx): Calculates the prefix sum of the array from index 1 to 'idx' (inclusive).
        sumRange(i, j): Calculates the sum of elements in the range [i, j] (inclusive).
    """

    def __init__(self, N):
        self.N = N
        self.bitArr = [0] * (N + 1)  # 1-indexed
        self.nums = [0] * (N + 1)
        self.M = 1e9 + 7

    # Increase the value at index 'i' in the original array by 'delta'.
    # Update the corresponding nodes in the Fenwick Tree accordingly.
    def updateDelta(self, i, delta):
        while i <= self.N:
            self.bitArr[i] += delta
            # self.bitArr[i] %= self.M  # Uncomment for modulo operation
            i += self.lowbit(i)

    # Calculate the prefix sum of the array from index 1 to 'idx' (inclusive).
    def queryPreSum(self, idx):
        result = 0
        while idx:
            result += self.bitArr[idx]
            # result %= self.M  # Uncomment for modulo operation
            idx -= self.lowbit(idx)
        return result

    # Calculate the sum of the elements in the range [i, j] (inclusive).
    def sumRange(self, i, j):
        return self.queryPreSum(j) - self.queryPreSum(i - 1)

    def lowbit(self, x):
        return x & -x
