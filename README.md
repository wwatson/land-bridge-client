# land-bridge-client

# To setup your AWS CLI
`aws configure --profile hack`

`grab repo`

# Install node dependencies
`npm install`

# to deploy and create static assets
`npm run build`

# to run local server
`npm start`

# To deploy to s3
`aws s3 cp ./build/ s3://www.bbtrain.me --recursive --profile hack`