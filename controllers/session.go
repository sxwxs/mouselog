// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package controllers

import (
	"github.com/microsoft/mouselog/trace"
	"github.com/microsoft/mouselog/util"
)

func (c *APIController) GetSessions() {
	c.Data["json"] = trace.GetSessions(c.Input().Get("websiteId"), util.ParseInt(c.Input().Get("resultCount")), util.ParseInt(c.Input().Get("offset")), c.Input().Get("sortField"), c.Input().Get("sortOrder"))
	c.ServeJSON()
}

func (c *APIController) GetSession() {
	c.Data["json"] = trace.GetSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}

func (c *APIController) GetSessionId() {
	sessionId := c.StartSession().SessionID()

	//trace.AddSession(sessionId, c.Input().Get("websiteId"), c.getUserAgent(), c.getClientIp(), c.Input().Get("userId"))

	c.Data["json"] = sessionId
	c.ServeJSON()
}

func (c *APIController) DeleteSession() {
	c.Data["json"] = trace.DeleteSession(c.Input().Get("id"), c.Input().Get("websiteId"))
	c.ServeJSON()
}
