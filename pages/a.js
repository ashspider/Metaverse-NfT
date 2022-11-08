export async function stake (amount) {
    try {
        if (typeof  window.ethereum !== undefined) {
            await window.ethereum.enable()
            const provider = new providers.Web3Provider(window.ethereum)
            const network = (await provider.getNetwork()).chainId
            const token = new Contract (
                Token.networks[network].address,
                Token.abi,
                provider.getSigner()
            )            
            const staking = new Contract(
                Staking.networks[network].address,
                Staking.abi,
                provider.getSigner()
            )
            await token.approve(staking.address, utils.parseEther(amount.toString()))
            await staking.stake(utils.parseEther(amount.toString()))
        } else {
            throw new Error("No injected web3 found")
        }
    } catch (e) {
        console.log(e)
        throw Error(e.message)
    }
}