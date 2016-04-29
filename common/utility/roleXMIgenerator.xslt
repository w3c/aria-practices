<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:xmi="http://schema.omg.org/spec/XMI/1.2" xmlns:UML="org.omg.xmi.namespace.UML" exclude-result-prefixes="html xsl xs fn">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>

	<xsl:template match="/">
		<XMI xmi.version="1.2">
			<XMI.header>
				<XMI.metamodel xmi.name="UML" xmi.version="1.4"/>
			</XMI.header>
			<XMI.content>
				<UML:Model xmi.id="aria_roles" name="ARIA Roles Class Diagram">
					<UML:Namespace.ownedElement>
						<xsl:apply-templates select="//html:div[@class='role']"/>
					</UML:Namespace.ownedElement>
				</UML:Model>
			</XMI.content>
		</XMI>
	</xsl:template>

	<xsl:template match="html:div[@class='role']">
		<xsl:variable name="id" select="@id"/>
		<xsl:variable name="isAbstract"><xsl:choose>
				<xsl:when test="string-length(normalize-space(descendant::html:td[@class = 'role-abstract'])) &gt; 1">true</xsl:when>
				<xsl:otherwise>false</xsl:otherwise>
			</xsl:choose></xsl:variable>
		<UML:Class xmi.id="{$id}" name="{$id}" visibility="public" isAbstract="{$isAbstract}" isSpecification="false" isRoot="false" isLeaf="false" isActive="false">
			<xsl:if test="descendant::html:td[@class='role-parent']//html:rref">
				<UML:GeneralizableElement.generalization>
					<xsl:apply-templates select="descendant::html:td[@class='role-parent']//html:rref" mode="GeneralizableElement"/>
				</UML:GeneralizableElement.generalization>
			</xsl:if>
			<xsl:if test="$id = 'roletype'">
				<UML:Classifier.feature>
					<xsl:apply-templates select="//html:div[@class='state' or @class = 'property']" mode="globalstates"><xsl:sort select="@id"/></xsl:apply-templates>
				</UML:Classifier.feature>
			</xsl:if>
			<xsl:variable name="properties" select="descendant::html:td[@class='role-properties' or @class='role-required-properties']//html:pref | descendant::html:td[@class='role-properties' or @class='role-required-properties']//html:sref"/>
			<xsl:if test="$properties">
				<UML:Classifier.feature>
					<xsl:apply-templates select="$properties"/>
				</UML:Classifier.feature>
			</xsl:if>
		</UML:Class>
		<xsl:apply-templates select="descendant::html:td[@class='role-parent']//html:rref"/>
	</xsl:template>

	<xsl:template match="html:td[@class='role-properties' or @class='role-required-properties']//html:pref | html:td[@class='role-properties' or @class='role-required-properties']//html:sref">
		<xsl:variable name="id" select="generate-id()"/>
		<UML:Attribute xmi.id="{$id}" name="{.}" visibility="public" isSpecification="false" ownerScope="instance" changeability="changeable" targetScope="instance">
			<UML:StructuralFeature.multiplicity>
				<UML:Multiplicity xmi.id="{$id}-multiplicity">
					<UML:Multiplicity.range>
						<UML:MultiplicityRange xmi.id="{$id}-multiplicity-range" lower="1" upper="1"/>
					</UML:Multiplicity.range>
				</UML:Multiplicity>
			</UML:StructuralFeature.multiplicity>
		</UML:Attribute>
	</xsl:template>
	
	<xsl:template match="html:div[@class='state' or @class = 'property']" mode="globalstates">
		<xsl:variable name="applicability"><xsl:value-of select="normalize-space(descendant::html:td[@class='state-applicability' or @class = 'property-applicability'])"/></xsl:variable>
		<xsl:if test="$applicability = 'All elements of the base markup' or $applicability = 'All roles'">
			<xsl:variable name="id" select="generate-id()"/>
			<UML:Attribute xmi.id="{$id}" name="{@id}" visibility="public" isSpecification="false" ownerScope="instance" changeability="changeable" targetScope="instance">
				<UML:StructuralFeature.multiplicity>
					<UML:Multiplicity xmi.id="{$id}-multiplicity">
						<UML:Multiplicity.range>
							<UML:MultiplicityRange xmi.id="{$id}-multiplicity-range" lower="1" upper="1"/>
						</UML:Multiplicity.range>
					</UML:Multiplicity>
				</UML:StructuralFeature.multiplicity>
			</UML:Attribute>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="html:td[@class='role-parent']//html:rref">
		<xsl:variable name="id" select="generate-id()"/>
		<UML:Generalization xmi.id="{$id}" isSpecification="false" name="{ancestor::html:*[@class='role']/@id} to {.}">
			<UML:Generalization.child>
				<UML:Class xmi.idref="{ancestor::html:*[@class='role']/@id}"/>
			</UML:Generalization.child>
			<UML:Generalization.parent>
				<UML:Class xmi.idref="{.}"/>
			</UML:Generalization.parent>
		</UML:Generalization>
	</xsl:template>
	
	<xsl:template match="html:td[@class='role-parent']//html:rref" mode="GeneralizableElement">
		<UML:Generalization xmi.idref="{generate-id()}"/>
	</xsl:template>
</xsl:stylesheet>
