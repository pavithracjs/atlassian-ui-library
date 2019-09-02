Media card now emit analytics events which payload and context stuctures reflect GASv3 payload specification.
Media Analytics Listener merges Payload and Context data before sending it to the backend. The merge is based on attributes.packageName equality
Media Analytics Listener adds packageHierarchy attribute to merged payload, the same way Atlaskit Listener does.