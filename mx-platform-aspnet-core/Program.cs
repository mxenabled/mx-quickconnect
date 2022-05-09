using MX.Platform.CSharp.Api;
using MX.Platform.CSharp.Client;
using MX.Platform.CSharp.Model;

// Globals
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var config = builder.Configuration
    .GetSection("MXClientConfiguration").Get<Configuration>();

var apiInstance = new MxPlatformApi(config);

// Api scoped
app.MapGet("/api/users", () =>
{
  return apiInstance.ListUsers();
});

app.MapPost("/api/users/new", () =>
{
  var requestBody = new UserCreateRequestBody(
    user: new UserCreateRequest(
      metadata: "Creating a user!"
    )
  );

  return apiInstance.CreateUser(requestBody);
});

app.MapPost("/api/get_mxconnect_widget_url/{user_guid}", (string user_guid) =>
{
  var acceptLanguage = "en-US";
  var widgetRequest = new WidgetRequest(widgetType: "connect_widget");
  var widgetRequestBody = new WidgetRequestBody(widgetRequest);

  return apiInstance.RequestWidgetURL(user_guid, widgetRequestBody, acceptLanguage);
});

// Users scoped
app.MapGet("/users/{user_guid}/members/{member_guid}/verify",
    (string user_guid, string member_guid) =>
{
  return apiInstance.ListAccountNumbersByMember(member_guid, user_guid);
});

app.MapGet("/users/{user_guid}/members/{member_guid}/identify",
    (string user_guid, string member_guid) =>
{
  return apiInstance.ListAccountOwnersByMember(member_guid, user_guid);
});

app.MapPost("/users/{user_guid}/members/{member_guid}/identify",
    (string user_guid, string member_guid) =>
{
  return apiInstance.IdentifyMember(member_guid, user_guid);
});

app.MapGet("/users/{user_guid}/members/{member_guid}/check_balance",
    (string user_guid, string member_guid) =>
{
  return apiInstance.CheckBalances(member_guid, user_guid);
});

app.MapGet("/users/{user_guid}/members/{member_guid}/transactions",
    (string user_guid, string member_guid) =>
{
  return apiInstance.ListTransactionsByMember(member_guid, user_guid);
});

app.MapGet("/users/{user_guid}/accounts", (string user_guid) =>
{
  return apiInstance.ListUserAccounts(user_guid);
});

app.MapGet("/users/{user_guid}/members/{member_guid}/status",
    (string user_guid, string member_guid) =>
{
  return apiInstance.ReadMemberStatus(member_guid, user_guid);
});

app.Run();
