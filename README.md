# ZAP-AutomationFramework
API Penetration Testing Using ZAP Automation Framework

### Running Scan on Pet Store API

1. Pull Docker image-
```
docker pull softwaresecurityproject/zap-stable
```
2. Clone the repository, from the root folder run scan with ZAP File for Pet Store (Sample OpenAPI Specification)
```
docker container run -v $(pwd):/zap/wrk/:rw -t softwaresecurityproject/zap-stable bash -c "zap.sh -cmd -addoninstall ascanrules -addoninstall openapi; zap.sh -cmd -autorun /zap/wrk/plans/plan.yaml"
```
3. Scan reports will be available in following folders- 
   
   a. HTML Report: petStoreHtmlReport 
   
   b. XML Report: petStoreXmlReport

## Running scan on locally hosted Juice Shop APIs

1. Pull docker image for Juice Shop
```
docker pull bkimminich/juice-shop
```
2. Host the application on local
```
docker run -d -p 3000:3000 bkimminich/juice-shop
```
3. Pull latest docker image of zap-stable
```
docker pull softwaresecurityproject/zap-stable
```
4. Run scan
```
docker container run --platform linux/arm64 -v $(pwd):/zap/wrk/:rw -t softwaresecurityproject/zap-stable bash -c "zap.sh -cmd -autorun /zap/wrk/plans/owasp_juiceshop_plan_docker_with_auth.yaml"
```

## Analysis
HTML & XML reports will be generated which can be analyzed.

## Troubleshooting

If your docker getting terminated while active scan (Killed) without completing all the tasks in plan file.
You need to increase memory limit for docker
```
colima start --cpu 4 --memory 8
```