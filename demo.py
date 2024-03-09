def countWays(self, n, s):
        mod = 1003
        exp = s
        @lru_cache(maxsize=None)
        def solve(requirement, l, r):
            if abs(l-r) == 1:
                if exp[l] == requirement:
                    return 1
                else:
                    return 0
                
            res = 0
            for i in range(l, r):
                if not exp[i].isalpha():
                    lt = solve('T', l, i)
                    lf = solve('F', l, i)
                    rt = solve('T', i+1, r)
                    rf = solve('F', i+1, r)
                        if requirement == 'T':
                            res += lt * rt
                        else:
                            res += (lf * rf) + (lf * rt) + (lt * rf)
                    elif exp[i] == '|':
                        if requirement == 'T':
                            res += (lt * rt) + (lf * rt) + (lt * rf)
                        else:
                            res += lf * rf
                    elif exp[i] == '^':
                        if requirement == 'T':
                            res += (lf * rt) + (lt * rf)
                        else:
                            res += (lf * rf) + (lt * rt)
            
            return res % mod
        
        return solve('T', 0, n) % mod