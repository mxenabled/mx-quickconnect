using MX.Platform.CSharp.Api;
using MX.Platform.CSharp.Client;
using MX.Platform.CSharp.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

// Globals
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var config = builder.Configuration
    .GetSection("MXClientConfiguration").Get<Configuration>();

var apiInstance = new MxPlatformApi(config);

var contractResolver = new DefaultContractResolver
{
  NamingStrategy = new SnakeCaseNamingStrategy()
};

// Methods
UserResponseBody CreateUser()
{
  var requestBody = new UserCreateRequestBody(
    user: new UserCreateRequest(
      metadata: "Creating a user!"
    )
  );

  return apiInstance.CreateUser(requestBody);
};

string ConvertToSnakeCase(object camelized)
{
  return JsonConvert.SerializeObject(camelized, new JsonSerializerSettings
  {
    ContractResolver = contractResolver,
    Formatting = Formatting.Indented
  });
};

// Api scoped
app.MapGet("/api/users", () =>
{
  return ConvertToSnakeCase(apiInstance.ListUsers());
});

app.MapPost("/api/get_mxconnect_widget_url", () =>
{
  var acceptLanguage = "en-US";
  var widgetRequest = new WidgetRequest(
      widgetType: "connect_widget",
      mode: "verification"
  );
  var widgetRequestBody = new WidgetRequestBody(widgetRequest);
  var user_guid = CreateUser().User.Guid;
  var result = apiInstance.RequestWidgetURL(user_guid, widgetRequestBody, acceptLanguage);

  return ConvertToSnakeCase(result);
});

// Users scoped
app.MapGet("/users/{user_guid}/members/{member_guid}/verify",
    (string user_guid, string member_guid) =>
{
  var result = apiInstance.ListAccountNumbersByMember(member_guid, user_guid);

  return ConvertToSnakeCase(result);
});

app.MapGet("/users/{user_guid}/members/{member_guid}/identify",
    (string user_guid, string member_guid) =>
{
  var result = apiInstance.ListAccountOwnersByMember(member_guid, user_guid);

  return ConvertToSnakeCase(result);
});

app.MapPost("/users/{user_guid}/members/{member_guid}/identify",
    (string user_guid, string member_guid) =>
{
  var result = apiInstance.IdentifyMember(member_guid, user_guid);

  return ConvertToSnakeCase(result);
});

app.MapGet("/users/{user_guid}/members/{member_guid}/check_balance",
    (string user_guid, string member_guid) =>
{
  var result = apiInstance.ListUserAccounts(user_guid);

  return ConvertToSnakeCase(result);
});

app.MapPost("/users/{user_guid}/members/{member_guid}/check_balance",
    (string user_guid, string member_guid) =>
{
  var result = apiInstance.CheckBalances(member_guid, user_guid);

  return ConvertToSnakeCase(result);
});

app.MapGet("/users/{user_guid}/members/{member_guid}/transactions",
    (string user_guid, string member_guid) =>
{
  var result = apiInstance.ListTransactionsByMember(member_guid, user_guid);

  return ConvertToSnakeCase(result);
});

app.MapGet("/users/{user_guid}/members/{member_guid}/status",
    (string user_guid, string member_guid) =>
{
  var result = apiInstance.ReadMemberStatus(member_guid, user_guid);

  return ConvertToSnakeCase(result);
});

app.Run();
