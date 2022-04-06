import dotenv from 'dotenv'
import express from 'express'

import { Configuration, MxPlatformApi } from 'mx-platform-node';

dotenv.config({ path: '../.env' })
var port = process.env.PORT || 8000

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

var userGuid = null

var listener = app.listen(port, function () {
    console.log('mx-quickstart node backend is listening on port ' + listener.address().port)
})

const configuration = new Configuration({
    // Configure with your Client ID/API Key from https://dashboard.mx.com
    username: process.env.CLIENT_ID,
    password: process.env.API_KEY,

    // Configure environment. https://int-api.mx.com for development, https://api.mx.com for production
    basePath: 'https://int-api.mx.com',

    baseOptions: {
        headers: {
            Accept: 'application/vnd.mx.api.v1+json'
        }
    }
})
const client = new MxPlatformApi(configuration)

app.get('/api/:memberGuid/status', async function(request, response) {
    const statusResponse = await client.readMemberStatus(request.params.memberGuid, userGuid)
    response.json (statusResponse.data)
})

app.get('/api/auth/:memberGuid', async function(request, response) {
    const accountNumbersResponse = await client.listAccountNumbersByMember(request.params.memberGuid, userGuid)
    response.json(accountNumbersResponse.data)
})
app.get('/api/balances', async function(request, response) {
    const listUserAccountsResponse = await client.listUserAccounts(userGuid)
    response.json(listUserAccountsResponse.data)
})
app.post('/api/balances', async function(request, response) {
    const balancesResponse = await client.checkBalances(request.body.member_guid, request.body.user_guid)
    response.json (balancesResponse.data)
})
app.post('/api/get_mxconnect_widget_url', async function(request, response) {
    const createUserRequestBody = {
        user: {
            id: request.body.user_id ? request.body.user_id : null
        }
    }

    try {
        const createUserResponse = await client.createUser(createUserRequestBody)

        userGuid = createUserResponse.data.user.guid
    
        const widgetRequestBody = {
            widget_url : { 
                include_transactions: true,
                is_mobile_webview: false,
                mode: 'verification',
                ui_message_version: 4,
                wait_for_full_aggregation: true,
                widget_type: 'connect_widget'
            }
        }
    
        const widgetResponse = await client.requestWidgetURL(userGuid, widgetRequestBody)
        response.json(widgetResponse.data)

    } catch (e) {
        response.status(e.response.status).send({ 'errorMessage' : e.response.data.error.message })
    }

})
app.get('/api/holdings', async function(request, response) {
    const listHoldingsResponse = await client.listHoldings(userGuid)
    response.json(listHoldingsResponse.data)
})
app.post('/api/holdings', async function(request, response) {
    const aggregateMemberResponse = await client.aggregateMember(request.body.member_guid, request.body.user_guid)
    response.json(aggregateMemberResponse.data)
})
app.get('/api/identity/:memberGuid', async function(request, response) {
    const listAccountOwnersResponse = await client.listAccountOwnersByMember(request.params.memberGuid, userGuid)
    response.json(listAccountOwnersResponse.data)
})
app.post('/api/identity/:memberGuid', async function(request, response) {
    const identifyMemberResponse = await client.identifyMember(request.params.memberGuid, userGuid)
    response.json(identifyMemberResponse.data)
})
app.get('/api/transactions/:memberGuid', async function (request, response) {
    const listTransactionsResponse = await client.listTransactionsByMember(request.params.memberGuid, userGuid)
    response.json (listTransactionsResponse.data)
})
