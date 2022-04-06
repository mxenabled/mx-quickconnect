import dotenv from 'dotenv'
import express from 'express'

import { Configuration, MxPlatformApi } from 'mx-platform-node';

dotenv.config({ path: '../.env' })
var port = process.env.PORT || 8000

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

var user_guid = null

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

app.get('/api/auth/:memberGuid', async function(request, response) {
    const accountNumbersResponse = await client.listAccountNumbersByMember(request.params.memberGuid, user_guid)
    response.json(accountNumbersResponse.data)
})

app.post('/api/get_mxconnect_widget_url', async function(request, response) {
    const createUserRequestBody = {
        user: {
            id: request.body.user_id
        }
    }
    const createUserResponse = await client.createUser(createUserRequestBody)
    user_guid = createUserResponse.data.user.guid

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

    const widgetResponse = await client.requestWidgetURL(user_guid, widgetRequestBody)
    response.json(widgetResponse.data)
})