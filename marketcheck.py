
class SearchFilters():
    
    def __init__(self):
        self.filters = dict()                
    
    def set(param, value):
        self.filters[param] = value 

    def search(param):
        #build the url
        query = "http://api.marketcheck.com/v2/search/car/active?api_key={0}".format(api_key)
        int i = 0
        for param in filters:                        
            filter = "&{0}={1}".format(param, filters[param])
            query += filter            
            append to query


        #uses curl to call url 

        # return json response
        
            

# car type (new used certified)
# body type
# body subtype
# vehicle type
# seller type
# year
# make
# model
# trim
# drivetrain
# transmission
# engine, engine size
# fuel type
# doors
# cylinders
# exterior color
# interior color
# radius
# latitude
# longitude
# vin
# price (range)
# miles (range)
# days on market (range)
