import xrpl
import os
from dotenv import load_dotenv

load_dotenv()

testnet_url = os.environ["XRPC_URL_TESTNET"]

def get_account(seed):
    """get_account"""
    client = xrpl.clients.JsonRpcClient(testnet_url)
    if (seed == ''):
        new_wallet = xrpl.wallet.generate_faucet_wallet(client)
    else:
        new_wallet = xrpl.wallet.Wallet.from_seed(seed)
    return new_wallet

def get_account_info(accountId):
    """get_account_info"""
    client = xrpl.clients.JsonRpcClient(testnet_url)
    acct_info = xrpl.models.requests.account_info.AccountInfo(
        account=accountId,
        ledger_index="validated"
    )
    response = client.request(acct_info)
    return response.result['account_data']

def send_xrp(account, amount, destination):
    client = xrpl.clients.JsonRpcClient(testnet_url)
    payment = xrpl.models.transactions.Payment(
        account=account.address,
        amount=xrpl.utils.xrp_to_drops(int(amount)),
        destination=destination,
    )
    print('Payment: ', payment)
    try:	
        response = xrpl.transaction.submit_and_wait(payment, client, account)	
    except xrpl.transaction.XRPLReliableSubmissionException as e:	
        response = f"Submit failed: {e}"

    return response

def main():
    account = get_account('')
    print('Account: ', account)
    account_info = get_account_info(account.address)
    print('Info: ', account_info)
    print('Sending XRP...')
    print('Seed: ', account.seed)
    print('Amount: ', 1)
    print('Destination: ', 'rEVCtiZXo9gMG26dCLtYHeN5YEVNRMtzGP')
    response = send_xrp(account, 1, 'rEVCtiZXo9gMG26dCLtYHeN5YEVNRMtzGP')
    print('Response: ', response)

if __name__ == "__main__":
    main()
