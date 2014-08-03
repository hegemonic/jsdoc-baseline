{% import '../../macros.swig' as macros %}

{% if mixes && mixes.length %}
    <dt>{{ translate('headings.mixes') }}</dt>
    {{ macros.listItems(mixes, { needsLink: true }) }}
{% endif %}
