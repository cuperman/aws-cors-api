all: package/aws-cors-api.zip

# Build the package
package/aws-cors-api: handlers/*.js index.js package.json
	mkdir -p package/aws-cors-api
	cp -r handlers index.js package.json package/aws-cors-api
	touch package/aws-cors-api

# Zip the package
package/aws-cors-api.zip: package/aws-cors-api
	cd ./package/aws-cors-api && zip -r ../aws-cors-api.zip *

# Configure the deployment (requires user input)
config.json:
	./bin/config update

# Prepare the package for deployment to AWS
package/template.yaml: package/aws-cors-api.zip config.json
	aws cloudformation package --template-file template.yaml --s3-bucket `./bin/config list s3_bucket` --output-template-file package/template.yaml

# Create or update stack on AWS
package/stacks.json: package/template.yaml
	aws cloudformation deploy --template-file ./package/template.yaml --stack-name `./bin/config list stack_name` --capabilities CAPABILITY_IAM \
		&& aws cloudformation describe-stacks --stack-name `./bin/config list stack_name` > package/stacks.json

deploy: package/stacks.json

clean:
	rm -rf package
