FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["AlibabaFood.Api.csproj", "./"]
RUN dotnet restore "AlibabaFood.Api.csproj"
COPY . .
RUN dotnet build "AlibabaFood.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AlibabaFood.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AlibabaFood.Api.dll"]
