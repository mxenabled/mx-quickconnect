using MX.Platform.CSharp.Api;
using MX.Platform.CSharp.Client;
using MX.Platform.CSharp.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using dotenv.net;

DotEnv.Load(options: new DotEnvOptions(envFilePaths: new[] {"./../.env"}));

// Globals
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var config = builder.Configuration
    .GetSection("MXClientConfiguration").Get<Configuration>();
config.Username = Environment.GetEnvironmentVariable("CLIENT_ID");
config.Password = Environment.GetEnvironmentVariable("API_KEY");

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

app.MapDelete("/api/user/{guid}", (string guid) =>
{
  apiInstance.DeleteUser(guid);
  return JsonConvert.SerializeObject(new { user_guid = guid });
});


app.MapPost("/api/get_mxconnect_widget_url", (IConfiguration config, HttpRequest request) =>
{
  var streamReader = new StreamReader(request.Body);
  var body = streamReader.ReadToEndAsync();
  var bodyResult = JsonConvert.DeserializeObject<Request>(body.Result);

  var acceptLanguage = "en-US";
  var widgetRequest = new WidgetRequest(
      widgetType: "connect_widget",
      mode: "verification",
      uiMessageVersion: 4,
      includeTransactions: true
  );
  var widgetRequestBody = new WidgetRequestBody(widgetRequest);
  var userGuid = bodyResult.UserGuid;
  if (userGuid == null) {
    userGuid = CreateUser().User.Guid;
  }
  var result = apiInstance.RequestWidgetURL(userGuid, widgetRequestBody, acceptLanguage);

  return ConvertToSnakeCase(result);
});

// Users scoped
app.MapGet("/users/{userGuid}/members/{memberGuid}/verify",
    (string userGuid, string memberGuid) =>
{
  var result = apiInstance.ListAccountNumbersByMember(memberGuid, userGuid);

  return ConvertToSnakeCase(result);
});

app.MapGet("/users/{userGuid}/members/{memberGuid}/identify",
    (string userGuid, string memberGuid) =>
{
  var result = apiInstance.ListAccountOwnersByMember(memberGuid, userGuid);

  return ConvertToSnakeCase(result);
});

app.MapPost("/users/{userGuid}/members/{memberGuid}/identify",
    (string userGuid, string memberGuid) =>
{
  var result = apiInstance.IdentifyMember(memberGuid, userGuid);

  return ConvertToSnakeCase(result);
});

app.MapGet("/users/{userGuid}/members/{memberGuid}/check_balance",
    (string userGuid, string memberGuid) =>
{
  var result = apiInstance.ListUserAccounts(userGuid);

  return ConvertToSnakeCase(result);
});

app.MapPost("/users/{userGuid}/members/{memberGuid}/check_balance",
    (string userGuid, string memberGuid) =>
{
  var result = apiInstance.CheckBalances(memberGuid, userGuid);

  return ConvertToSnakeCase(result);
});

app.MapGet("/users/{userGuid}/members/{memberGuid}/transactions",
    (string userGuid, string memberGuid) =>
{
  var result = apiInstance.ListTransactionsByMember(memberGuid, userGuid);

  return ConvertToSnakeCase(result);
});

app.MapGet("/users/{userGuid}/members/{memberGuid}/status",
    (string userGuid, string memberGuid) =>
{
  var result = apiInstance.ReadMemberStatus(memberGuid, userGuid);

  return ConvertToSnakeCase(result);
});

app.Run();

class Request
{
  [JsonProperty("user_guid")]
  public string? UserGuid { get; set; }

  [JsonProperty("user_id")]
  public string? UserId { get; set; }
};
