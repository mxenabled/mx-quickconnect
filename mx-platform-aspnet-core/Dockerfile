FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-mx
WORKDIR /source
RUN wget https://github.com/mxenabled/mx-platform-csharp/archive/refs/tags/v0.8.1.tar.gz && \
  tar -vxzf v0.8.1.tar.gz && \
  cd mx-platform-csharp-0.8.1 && \
  cd src/MX.Platform.CSharp/ &&\
  dotnet build

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source
COPY mx-platform-aspnet-core/*.csproj .
RUN dotnet restore
COPY mx-platform-aspnet-core .
RUN dotnet add package Json.NET -v 1.0.33
RUN dotnet publish -c release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
RUN mkdir -p bin/Debug/net6.0/
COPY --from=build-mx /source/mx-platform-csharp-0.8.1/src/MX.Platform.CSharp/bin/Debug/netstandard2.0/MX.Platform.CSharp.dll  bin/Debug/net6.0/
COPY --from=build /app .
EXPOSE 8000
CMD ["dotnet","mx-platform-aspnet.dll"]
