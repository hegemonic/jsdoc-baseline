{% set COLUMNS = 3 %}
{% set sections = docs|balancedGroup(COLUMNS) %}

<div {{ cssClass('!symbol-index') }}>
    <div {{ cssClass('!symbol-index-content') }}>
        <section>
            {% set previousHeading = null %}
            {% set nextHeading = null %}
            {% set continuedId = '' %}
            {% set continuedIdAttribute = '' %}
            {% set continuedIdCounter = 0 %}
            {% set headingBaseText = null %}

            {% for section in sections %}
                {% set nextSection = sections[loop.index] %}
                {% if nextSection %}
                    {% set nextSectionHeading = Object.keys(nextSection)[0] %}
                {% else %}
                    {% set nextSectionHeading = null %}
                {% endif %}

                <div {{ cssClass('!symbol-index-column') }}>
                    {% set headings = Object.keys(section) %}
                    {% for heading in headings %}
                        {% set headingBaseText = translate('alphaList.' + heading) %}
                        {% if previousHeading === heading %}
                            {% set headingText =
                                translate('headings.continued', { text: headingBaseText }) %}
                        {% else %}
                            {% set headingText = headingBaseText %}
                        {% endif %}

                        {% set context = {
                            doclets: section[heading],
                            headingId: continuedIdAttribute,
                            headingText: headingText
                        } %}

                        {% include 'symbolindexsection.swig' with context only %}

                        {% set continuedId = '' %}
                        {% set previousHeading = heading %}
                    {% endfor %}
                    {% if nextSectionHeading === previousHeading %}
                        {# TODO: use helper to ensure that the ID is unique #}
                        {% set continuedId = 'index-continued-' + continuedIdCounter %}
                        {% set continuedIdAttribute = 'id="' + continuedId + '"' %}
                        {% set continuedIdCounter = continuedIdCounter + 1 %}
                        <p {{ cssClass('!symbol-index-continued') }}>
                            <a href="#{{ continuedId }}">
                                {{ translate('continued', { text: headingBaseText }) }}
                            </a>
                        </p>
                    {% endif %}
                </div>
            {% endfor %}
        </section>
    </div>
</div>
