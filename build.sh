## THIS WILL BUILD AND PUSH TO AZURE - DON'T DO THIS UNLESS YOU WANT TO CHANGE THE AZURE INSTANCE
az acr login --name datafusion
docker build --build-arg REACT_APP_API_HOST=http://datafusion-ai-cbcyd6fsbbh4dehj.australiaeast-01.azurewebsites.net/api -t datafusion.azurecr.io/datafusionai:latest .
docker push datafusion.azurecr.io/datafusionai:latest
az webapp restart --name datafusion-ai --resource-group QUT-DEV-ARG-DataFusion-AI