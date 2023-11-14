# ZAP-AutomationFramework
API Penetration Testing Using ZAP Automation Framework

###Running Scan

1. Pull Docker image-
```
docker pull owasp/zap2docker-stable
```
2. Clone the repository, from the root folder run scan with ZAP File for Pet Store (Sample OpenAPI Specification)
```
docker container run -v $(pwd):/zap/wrk/:rw -t softwaresecurityproject/zap-stable bash -c "zap.sh -cmd -addoninstall ascanrules -addoninstall openapi; zap.sh -cmd -autorun /zap/wrk/plans/plan.yaml"
```
3. Scan reports will be available in following folders- 
   
   a. HTML Report: petStoreHtmlReport 
   
   b. XML Report: petStoreXmlReport