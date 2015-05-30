const Culture = "en-US";

// No need to pass the complete statement since *normally* each constituent is uniquely defined by its record. 
// Similarly we will need to extract a string used as identifier when we will aggregate results. This string is for computing only and we don't even need to know what is in it.

exports.GetIdFromVerb = function( verb)
{
  // use id wich is required 
  // https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md#verb
  return verb.id;
}

exports.GetIdFromActivity = function( activity)
{
  if (!activity.objectType || (activity.objectType == "Activity"))
    return "Activity:" + activity.id;
  else
  if ((activity.objectType == "StatementRef"))
      return "StatementRef:" + activity.id;
  else
  if ((activity.objectType == "SubStatement"))
      return "SubStatement:" + exports.GetIdFromActivity( activity.object);
  else
  if ((activity.objectType == "Agent"))
      return "Agent:" + exports.GetIdFromActor( activity.object);
  else
  if ((activity.objectType == "Group"))
      return "Group:" + exports.GetIdFromActor( activity.object);
  else
    return "Void";
}

exports.GetIdFromActor = function( actor)
{
  if (!actor.objectType || (actor.objectType == "Agent"))
    return actor.id;
  else
  if ((actor.objectType == "Group"))
    // TODO: id is optionnal
    return actor.id;
  else
    return "Void";
}

exports.GetValFromLngMap = function( display, Culture, id)
{
  if ( display[ Culture])
    // perfect Match
    return display[ Culture];
  else
  {
    var PosHyphen = Culture.indexOf( "-");
    if ( PosHyphen >= 0)
    {
      var Lng = Culture.substr( 0, PosHyphen);
      // en-US -> en-
      for (LngIt in display) {
        // https://tools.ietf.org/html/rfc5645
        if ( LngIt.substr( 0, PosHyphen) == Lng)
          // en-GB
          return display[ LngIt];
      }
    }
    // return ANY string fr-FR -> en-GB or it-IT which comes first
    for (LngIt in display) {
      return display[ LngIt];
    }
    return id;
  }
}

exports.GetDisplayLabelFromActor = function( actor)
{
  if ( !actor.name)
    return exports.GetIdFromActor( actor);
  else
    return actor.name;
}

exports.GetDisplayLabelFromVerb = function( verb)
{
  if ( !verb.display)
    return verb.id;
  else
    return exports.GetValFromLngMap( verb.display, Culture, verb.id);
}

exports.GetDisplayLabelFromActivity = function( activity)
{
  if (!activity.objectType || (activity.objectType == "Activity"))
  {
    if ( activity.definition)
    if ( activity.definition.name)
      return exports.GetValFromLngMap( activity.definition.name, Culture, "Activity:" + activity.id);
    return "Activity:" + activity.id;
  }
  // TODO Continue here
  else
  if ((activity.objectType == "StatementRef"))
      return "StatementRef:" + activity.id;
  else
  if ((activity.objectType == "SubStatement"))
      return "SubStatement:" + exports.GetIdFromActivity( activity.object);
  else
  if ((activity.objectType == "Agent"))
      return "Agent:" + exports.GetIdFromActor( activity.object);
  else
  if ((activity.objectType == "Group"))
      return "Group:" + exports.GetIdFromActor( activity.object);
  else
    return "Void";
  if ( !verb.display)
    return verb.id;
  else
    return exports.GetValFromLngMap( verb.display, Culture, verb.id);
}
