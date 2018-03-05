export default compose = (...funcs) => 
	(...args) => {
        // Compose 是從最後往回執行
		// 因為第一次可以接受多個參數，所以需要特別處理
    const initFuncs = funcs.slice(0, -1) // 除了最後一個 func
		const [lastFunc] = funcs.slice(-1) // 最後一個 func
		return initFuncs.reduceRight(
			(acc, func) => func(acc),
			lastFunc.apply(null, args)
		)
	}
  
