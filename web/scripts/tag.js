var TagBox = React.createClass({
  
  getInitialState: function(){
    return {data: []};
  },

  componentDidMount: function(){
    $.ajax({
      url: this.props.url,
      crossDomain: true,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleCommentSubmit: function(tag){
    $.ajax({
      url: this.props.addUrl,
      dataType: 'json',
      type: 'POST',
      data: tag,
      success: function(data) {
        this.setState({data: this.state.data.concat(data)});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function(){
    return (
      <div className="tagBox">
        <TagList data={this.state.data} />
        <TagForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var TagForm = React.createClass({
  getInitialState: function(){
    return {name: 'tagName', uri: 'tagUri', xpath: 'tagXpath'};
  },

  handleNameChange: function(e){
    this.setState({name: e.target.value});
  },

  handleUriChange: function(e){
    this.setState({uri: e.target.value});
  },

  handleXpathChange: function(e){
    this.setState({xpath: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var uri = this.state.uri.trim();
    var xpath = this.state.xpath.trim();

    if (!name || !uri || !xpath) {
      return;
    }
    this.props.onCommentSubmit({name: name, uri: uri, xpath: xpath});
    this.setState({name: '', uri: '', xpath: ''});
  },

  render: function(){
    return (
      <form className="tagForm" onSubmit={this.handleSubmit}>
        <input type="text" 
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <input type="text"
          value={this.state.uri}
          onChange={this.handleUriChange}
        />
        <input type="text"
          value={this.state.xpath}
          onChange={this.handleXpathChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var TagList = React.createClass({
  render: function(){
    var tagNodes = this.props.data.map(function(tag){
      return (
        <Tag name={tag.name} xpath={tag.xpath} uri={tag.uri} key={tag.id} id={tag.id} />
      );
    });

    return (
      <div className="tagList">
        {tagNodes}
      </div>
    );
  }
});

var Tag = React.createClass({

  render: function(){

    return (
      <div className="tag">
        <span>{this.props.name}</span>
        <a href={this.props.uri+"#tagxus_"+this.props.id}>{this.props.uri}</a>
        <span>{this.props.xpath}</span>
      </div>
    );
  }
})
ReactDOM.render(
  <TagBox url="http://localhost:8080/TagxusWS/tags/all" addUrl="http://localhost:8080/TagxusWS/tags" />,
  document.getElementById('content')
);