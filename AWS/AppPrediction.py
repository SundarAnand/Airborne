import boto3
import json
def lambda_handler(event, context):
    client = boto3.client('machinelearning')
    s3 = boto3.resource('s3')
    ddb_put = boto3.client('dynamodb')

    #looking up model id 
    model_name = 'ML model: AndroidSP'
    res = client.describe_ml_models(FilterVariable='Name', EQ=model_name)

    # looking up endpoint 
    model_id = res['Results'][0]['MLModelId']
    endpoint_url = res['Results'][0]['EndpointInfo']['EndpointUrl']

    dd = boto3.resource('dynamodb')
    table = dd.Table('TestWithZeros')
    try:
        response = table.get_item(
            Key={
                'Valid': "1"
            }
        )
    except:
        print("blah blah")
    else:
        item = response['Item']['result']
        
        # vals_str = str(item)
        output_dict=eval(item)
         
        # call out to AML
        response = client.predict(
            MLModelId=model_id,
            Record=output_dict,
            PredictEndpoint=endpoint_url 
        )
        
        ## sample output
        resultString = response['Prediction']['predictedLabel']
        print(resultString)
        # print the response
        res = resultString.encode('ascii','ignore')
        if(resultString == "9"):
            resultString = "#"
        
        table = dd.Table('resultFromAWSML')
    
        response1 = table.get_item(
            Key={
                'Valid': "1"
            }
        )
        
        # return response1 
        
        if(str(response1).find("Item")== -1):
            ddb_put_resp = ddb_put.put_item(
                TableName="resultFromAWSML",
                Item={
                    'Valid': {'S': "1"},
                    'result': {'S': resultString}
                    }
                )
        else:
            item1 = response1['Item']['result'] 
            
            if(item1==resultString):
            
                ddb_put_resp = ddb_put.put_item(
                    TableName="resultFromAWSML",
                    Item={
                        'Valid': {'S': "1"},
                        'result': {'S': "S"}
                        }
                    )
                    
            else:
                ddb_put_resp = ddb_put.put_item(
                TableName="resultFromAWSML",
                Item={
                    'Valid': {'S': "1"},
                    'result': {'S': resultString}
                    }
                )
                    
            
                
       
            
            