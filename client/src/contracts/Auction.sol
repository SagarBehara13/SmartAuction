pragma solidity >=0.6.0 <0.7.0;

contract Auction {

    uint public productsCount = 0;
    uint public bidsCount = 0;


    struct Product{
        uint id;
        uint256 initialPrice;
        uint256 currentPrice;
        string productName;
        address payable initialOwnerWalletAddress;
        address payable ownerWalletAddress;
        string productImage;
        string startDate;
        string endDate;
        bool sold;
        uint bidsCount;
    }

    struct ProductDetails{
        uint productId;
        string ownerContact;
        string initialOwnerContact;
        string ownerName;
        string initialOwnerName;
        string category;
        string description;
        string shortDescription;
        //uint maxBidId;
    }

    struct Bids{
        uint bidId;
        uint productId;
        uint amount;
        address payable sellerAddress;
        address payable bidderAddress;
        bool returned;
    }

    event ProductCreated (
        uint id,
        uint256 initialSellPrice,
        uint256 sellPrice,
        string productName,
        address initialOwnerWalletAddress,
        address ownerWalletAddress,
        string productImage,
        string startDate,
        string endDate,
        bool sold
    );

    //Bids[] productBids;

    mapping (uint => Product) public products;
    mapping (uint => Bids) public maxBidId;
    mapping (uint => ProductDetails) public productDetails;
    mapping (uint => Bids) public allbids;


    function createProduct(
        uint256 _initialSellPrice,
        string memory _productName,
        string memory _ownerName,
        string memory _initialOwnerContact,
        string memory _productImage,
        string memory _startDate,
        string memory _endDate,
        string memory _category,
        string memory _description,
        string memory _shortDescription
        ) public {
        require(bytes(_productName).length > 0);
        require(_initialSellPrice > 0);
        require(bytes(_startDate).length > 0);
        require(bytes(_endDate).length > 0);

        productsCount++;
        products[productsCount] = Product(productsCount, _initialSellPrice, _initialSellPrice, _productName, msg.sender, msg.sender, _productImage, _startDate, _endDate, false, 0);
        productDetails[productsCount] = ProductDetails(productsCount, _initialOwnerContact, _initialOwnerContact, _ownerName, _ownerName, _category, _description, _shortDescription);

        emit ProductCreated(productsCount, _initialSellPrice, _initialSellPrice, _productName, msg.sender, msg.sender, _productImage, _startDate, _endDate, false);

    }

    function bid (uint _productId, uint _amount, string memory _name, string memory _contact) public payable {
        Product memory _product = products[_productId];
        ProductDetails memory _productDetail = productDetails[_productId];
        address payable _seller = _product.initialOwnerWalletAddress;
        require(_product.id > 0 && _product.id <= productsCount, "ProductId smaller then productsCount or zero");
        require(_seller != msg.sender, "Auctioneer cannot bid on his own product");
        // Validation on frontend
        require(_amount > _product.currentPrice, "Cannot place bid, There's another bid with higher bidding amount");
        bidsCount++;

        _product.bidsCount = bidsCount;
        _product.currentPrice = _amount;
        _product.ownerWalletAddress = msg.sender;
        products[_productId] = _product;

        _productDetail.ownerContact = _contact;
        _productDetail.ownerName = _name;
        productDetails[_productId] = _productDetail;

        allbids[bidsCount] = Bids(bidsCount, _productId, _amount, _product.initialOwnerWalletAddress, msg.sender, false);
        maxBidId[_productId] = Bids(bidsCount, _productId, _amount, _product.initialOwnerWalletAddress, msg.sender, false);
    }

    function haltProductAuction(uint _productId) public payable {
        Product memory _product = products[_productId];
        _product.sold = true;
        products[_productId] = _product;
    }

    function finishAuction(uint _productId) public payable {
        Product memory _product = products[_productId];
        address payable _seller = _product.initialOwnerWalletAddress;

        require(msg.value >= _product.currentPrice);

        _seller.transfer(msg.value);
    }
}
