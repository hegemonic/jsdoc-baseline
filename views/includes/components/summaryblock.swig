{% if summaryItems && summaryItems.length %}
    <div {{ cssClass('!summary-callout') }}>
        {% if summaryHeadingKey %}
            {% set headingText = translate(summaryHeadingKey, summaryItems.length) %}
            <h {{ cssClass('!summary-callout-heading') }}>{{ headingText }}</h>
        {% endif %}
        <div {{ cssClass('!summary-content') }}>
            {% set COLUMN_COUNT = 3 %}
            {% set itemsPerColumn = Math.ceil(summaryItems.length / COLUMN_COUNT) %}

            {% set columnGroups = summaryItems|group(itemsPerColumn, COLUMN_COUNT) %}
            {% for columnGroup in columnGroups %}
                {% set context = { columnGroup: columnGroup } %}
                {% include 'summarycolumn.swig' with context only %}
            {% endfor %}
        </div>
    </div>
{% endif %}
